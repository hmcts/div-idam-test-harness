#!groovy

@Library("Infrastructure")

def type = "nodejs"

def product = "div"

def component = "div-idam-test-harness"

def channel = '#div-dev'

withPipeline(type, product, component) {
  enableSlackNotifications(channel)
}