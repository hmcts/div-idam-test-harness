#!groovy

@Library("Infrastructure")

// buildNode {
//   checkoutRepo()

//   try {
//     make 'install', name: 'Install dependencies'
//     make 'test', name: 'Test'

//     stage('Sonar scanner') {
//       onPR {
//         make 'sonar-scan-pr', name: 'Sonar Scan'
//       }

//       onMaster {
//         make 'sonar-scan', name: 'Sonar Scan'
//       }
//     }

//   } finally {
//     make 'clean'
//   }

//   onPR {
//     enforceVersionBump()
//   }

//   onMaster {
//     publishNodePackage()
//   }
// }

withPipeline(type , product, component) {
    echo ("I'm in");
    // if (env.CHANGE_TITLE && !env.CHANGE_TITLE.startsWith('[PREVIEW]')) {
    //     enableDockerBuild()
    //     enableDeployToAKS()
    // }

    // loadVaultSecrets(secrets)
    // setVaultName('div')

    // after('checkout') {
    //     echo '${product}-${component} checked out'
    // }

    // enableSlackNotifications(channel)
}