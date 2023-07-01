import { AbstractTool } from './AbstractTool.js'
import cfg from '../../../../lib/config/config.js'

export class EditCardTool extends AbstractTool {
  name = 'editCard'

  parameters = {
    properties: {
      qq: {
        type: 'string',
        description: '你想改名片的那个人的qq号，默认为聊天对象'
      },
      card: {
        type: 'string',
        description: '你想给他改的新名片'
      },
      groupId: {
        type: 'string',
        description: '群号'
      }
    },
    required: ['card', 'groupId']
  }

  description = '当你想要修改某个群员的群名片时有用。输入应该是群号、qq号和群名片，用空格隔开。'

  func = async function (opts, e) {
    let { qq, card, groupId } = opts
    qq = isNaN(qq) || !qq ? e.sender.user_id : parseInt(qq.trim())
    groupId = isNaN(groupId) || !groupId ? e.group_id : parseInt(groupId.trim())
    let group = await Bot.pickGroup(groupId)
    let mm = await group.getMemberMap()
    if (!mm.has(qq)) {
      return `failed, the user ${qq} is not in group ${groupId}`
    }
    if (mm.get(Bot.uin).role === 'member') {
      return `failed, you, not user, don't have permission to edit card in group ${groupId}`
    }
    logger.info('edit card: ', groupId, qq)
    await group.setCard(qq, card)
    return `the user ${qq}'s card has been changed into ${card}`
  }
}