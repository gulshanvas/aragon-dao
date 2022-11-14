import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { ReputataionTemplateDeployDao } from "../generated/schema"
import { ReputataionTemplateDeployDao as ReputataionTemplateDeployDaoEvent } from "../generated/ReputataionTemplate/ReputataionTemplate"
import { handleReputataionTemplateDeployDao } from "../src/reputataion-template"
import { createReputataionTemplateDeployDaoEvent } from "./reputataion-template-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let dao = Address.fromString("0x0000000000000000000000000000000000000001")
    let newReputataionTemplateDeployDaoEvent = createReputataionTemplateDeployDaoEvent(
      dao
    )
    handleReputataionTemplateDeployDao(newReputataionTemplateDeployDaoEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ReputataionTemplateDeployDao created and stored", () => {
    assert.entityCount("ReputataionTemplateDeployDao", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ReputataionTemplateDeployDao",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dao",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
