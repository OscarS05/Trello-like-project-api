const ChecklistDto = require('./checklist.dto');
const LabelDto = require('./label.dto');
const CardAttachmentDto = require('./card-attachment.dto');

class CardDto {
  constructor({ id, name, description, listId, createdAt, labels, members, attachments, checklists }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.listId = listId;
    this.createdAt = createdAt;

    if(Array.isArray(members)){
      this.cardMembers = members.length > 0 ? CardDto.formatMembers(members) : [];
    }
    if(Array.isArray(labels)){
      this.labels = labels.length > 0 ? labels.map(label => new LabelDto(label)) : [];
    }
    if(Array.isArray(attachments)){
      this.attachmentsCount = Array.isArray(attachments) ? attachments.length : 0;
    }
    if(Array.isArray(checklists)){
      this.checklistProgress = CardDto.calculateChecklistProgress(checklists);
    }
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
      userId: member?.workspaceMember?.user?.id || null,
      name: member?.workspaceMember?.user?.name || null,
    }));
  }

  static calculateChecklistProgress(checklists = []) {
    let total = 0;
    let checked = 0;

    for (const checklist of checklists) {
      for (const item of checklist.items || []) {
        total += 1;
        if (item.isChecked) checked += 1;
      }
    }

    return { total, checked };
  }
}

module.exports = CardDto;
