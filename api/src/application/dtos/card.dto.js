const ChecklistDto = require('./checklist.dto');
const LabelDto = require('./label.dto');
const CardAttachmentDto = require('./card-attachment.dto');

class CardDto {
  constructor({ id, name, description, listId, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.listId = listId;
    this.createdAt = createdAt;
  }

  static withChecklists(card){
    return {
      cardId: card.id,
      name: card.name,
      checklists: card.checklists.map(checklist => new ChecklistDto(checklist))
    };
  }

  static withAllCardInformation(card){
    return {
      id: card.id,
      name: card.name,
      description: card.description,
      listId: card.listId,
      createdAt: card.createdAt,
      labels: card.list?.project?.labels?.map(label => {
        const labelFormatted = label.get({ plain: true });
        const crd = label.cards.find(crd => crd.CardLabel.cardId == card.id)
        return new LabelDto({ ...labelFormatted, isVisible: crd ? crd.CardLabel.isVisible : false });
      }) || [],
      cardMembers: this.formatMembers(card.members),
      attachments: card.attachments?.map(attachment => new CardAttachmentDto(attachment)) || [],
      checklists: card.checklists?.map(checklist => new ChecklistDto(checklist)) || [],
    }
  }

  static formatMembers(members) {
    return members.map(member => ({
      id: member?.CardMember?.id || null,
      projectMemberId: member?.id || null,
      name: member?.workspaceMember?.user?.name || null,
    }));
  }
}

module.exports = CardDto;
