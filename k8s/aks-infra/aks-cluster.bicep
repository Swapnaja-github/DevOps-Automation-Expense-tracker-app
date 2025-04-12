// PARAMETERS SECTION
param baseName string = 'expensy'
param location string = 'uaenorth' // same as resource group region
param nodeCount int = 2
param nodeVmSize string = 'Standard_DS2_v2'
param adminUsername string = 'azureuser'
param sshPublicKey string
param logAnalyticsSku string = 'PerGB2018'

// VARIABLES SECTION
var clusterName = '${baseName}AksCluster'
var laWorkspaceName = '${baseName}-la-${uniqueString(resourceGroup().id)}' // Ensures unique name with proper length

// RESOURCES SECTION
// Create Log Analytics workspace for monitoring
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: laWorkspaceName
  location: location
  properties: {
    sku: {
      name: logAnalyticsSku
    }
    retentionInDays: 30  // Default retention period
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource aksCluster  'Microsoft.ContainerService/managedClusters@2023-01-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    dnsPrefix: toLower(clusterName)
    agentPoolProfiles: [
      {
        name: 'nodepool1'
        count: nodeCount
        vmSize: nodeVmSize
        osType: 'Linux'
        osDiskSizeGB: 30
        type: 'VirtualMachineScaleSets'
        mode: 'System'
      }
    ]
    linuxProfile: {
        adminUsername: adminUsername
        ssh: {
          publicKeys: [
            {
              keyData: sshPublicKey
            }
          ]
        }
      }
      addonProfiles: {
        omsagent: {
          enabled: true
          config: {
            logAnalyticsWorkspaceResourceID: logAnalyticsWorkspace.id // reference the Log Analytics workspace created above
          }
        }
      }
      enableRBAC: true
      networkProfile: {
        loadBalancerSku: 'standard'
      }
}

}

// OUTPUTS SECTION
output clusterName string = aksCluster.name
output clusterFqdn string = aksCluster.properties.fqdn // Fully Qualified Domain Name for cluster API server
output logAnalyticsWorkspaceId string = logAnalyticsWorkspace.properties.customerId
