targetScope = 'subscription'

param location string = 'uaenorth'
param resourceGroupName string = 'expensyAksRG'

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: location
}
