import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  ReputataionTemplateDeployDao,
  ReputataionTemplateSetupDao,
  ReputataionTemplateDeployToken,
  ReputataionTemplateInstalledApp
} from "../generated/ReputataionTemplate/ReputataionTemplate"

export function createReputataionTemplateDeployDaoEvent(
  dao: Address
): ReputataionTemplateDeployDao {
  let reputataionTemplateDeployDaoEvent = changetype<
    ReputataionTemplateDeployDao
  >(newMockEvent())

  reputataionTemplateDeployDaoEvent.parameters = new Array()

  reputataionTemplateDeployDaoEvent.parameters.push(
    new ethereum.EventParam("dao", ethereum.Value.fromAddress(dao))
  )

  return reputataionTemplateDeployDaoEvent
}

export function createReputataionTemplateSetupDaoEvent(
  dao: Address
): ReputataionTemplateSetupDao {
  let reputataionTemplateSetupDaoEvent = changetype<
    ReputataionTemplateSetupDao
  >(newMockEvent())

  reputataionTemplateSetupDaoEvent.parameters = new Array()

  reputataionTemplateSetupDaoEvent.parameters.push(
    new ethereum.EventParam("dao", ethereum.Value.fromAddress(dao))
  )

  return reputataionTemplateSetupDaoEvent
}

export function createReputataionTemplateDeployTokenEvent(
  token: Address
): ReputataionTemplateDeployToken {
  let reputataionTemplateDeployTokenEvent = changetype<
    ReputataionTemplateDeployToken
  >(newMockEvent())

  reputataionTemplateDeployTokenEvent.parameters = new Array()

  reputataionTemplateDeployTokenEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return reputataionTemplateDeployTokenEvent
}

export function createReputataionTemplateInstalledAppEvent(
  appProxy: Address,
  appId: Bytes
): ReputataionTemplateInstalledApp {
  let reputataionTemplateInstalledAppEvent = changetype<
    ReputataionTemplateInstalledApp
  >(newMockEvent())

  reputataionTemplateInstalledAppEvent.parameters = new Array()

  reputataionTemplateInstalledAppEvent.parameters.push(
    new ethereum.EventParam("appProxy", ethereum.Value.fromAddress(appProxy))
  )
  reputataionTemplateInstalledAppEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )

  return reputataionTemplateInstalledAppEvent
}
