import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  DeployDao,
  SetupDao,
  DeployToken,
  InstalledApp
} from "../generated/MembershipTemplate/MembershipTemplate"

export function createDeployDaoEvent(dao: Address): DeployDao {
  let deployDaoEvent = changetype<DeployDao>(newMockEvent())

  deployDaoEvent.parameters = new Array()

  deployDaoEvent.parameters.push(
    new ethereum.EventParam("dao", ethereum.Value.fromAddress(dao))
  )

  return deployDaoEvent
}

export function createSetupDaoEvent(dao: Address): SetupDao {
  let setupDaoEvent = changetype<SetupDao>(newMockEvent())

  setupDaoEvent.parameters = new Array()

  setupDaoEvent.parameters.push(
    new ethereum.EventParam("dao", ethereum.Value.fromAddress(dao))
  )

  return setupDaoEvent
}

export function createDeployTokenEvent(token: Address): DeployToken {
  let deployTokenEvent = changetype<DeployToken>(newMockEvent())

  deployTokenEvent.parameters = new Array()

  deployTokenEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return deployTokenEvent
}

export function createInstalledAppEvent(
  appProxy: Address,
  appId: Bytes
): InstalledApp {
  let installedAppEvent = changetype<InstalledApp>(newMockEvent())

  installedAppEvent.parameters = new Array()

  installedAppEvent.parameters.push(
    new ethereum.EventParam("appProxy", ethereum.Value.fromAddress(appProxy))
  )
  installedAppEvent.parameters.push(
    new ethereum.EventParam("appId", ethereum.Value.fromFixedBytes(appId))
  )

  return installedAppEvent
}
