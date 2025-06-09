const boom = require('@hapi/boom');

class CardMemberService {
  constructor(
    {
      getAllCardMembersUseCase,
      getCardMemberUseCase,
      addMemberToCardUseCase,
      deleteCardMemberUseCase,
    },
    { getMemberByIdUseCase },
  ) {
    this.getAllCardMembersUseCase = getAllCardMembersUseCase;
    this.getCardMemberUseCase = getCardMemberUseCase;
    this.addMemberToCardUseCase = addMemberToCardUseCase;
    this.deleteCardMemberUseCase = deleteCardMemberUseCase;

    // Project member use cases
    this.getMemberByIdUseCase = getMemberByIdUseCase;
  }

  async getCardMembers(cardId) {
    return this.getAllCardMembersUseCase.execute(cardId);
  }

  async getCardMember(cardId, cardMemberId) {
    return this.getCardMemberUseCase.execute(cardId, cardMemberId);
  }

  async addCardMember(cardId, projectMemberId, requesterAsProjectMember) {
    const projectMember = await this.getProjectMemberById(projectMemberId);
    if (!projectMember?.id)
      throw boom.notFound('The project member to be added does not found');
    if (projectMember.projectId !== requesterAsProjectMember.projectId) {
      throw boom.conflict(
        'The project member to be added does not belong to the project',
      );
    }

    const cardMembers = await this.getCardMembers(cardId);
    const memberToBeAdded = cardMembers.find(
      (member) => member.projectMemberId === projectMemberId,
    );
    if (memberToBeAdded?.id) {
      throw boom.conflict(
        'The project member to be added already belongs to the card',
      );
    }

    const addedMember = await this.addMemberToCardUseCase.execute(
      cardId,
      projectMemberId,
    );
    if (!addedMember?.id)
      throw boom.notFound(
        'Something went wrong while adding the project member to the card',
      );

    const cardMember = await this.getCardMember(cardId, addedMember.id);
    if (!cardMember?.id)
      throw boom.notFound('The new project member was not found in the card');

    return cardMember;
  }

  async delete(cardId, projectMemberId, requesterAsProjectMember) {
    const memberToBeRemoved = await this.getProjectMemberById(projectMemberId);
    if (!memberToBeRemoved?.id)
      throw boom.notFound('The member to be removed to the card was not found');
    if (memberToBeRemoved.projectId !== requesterAsProjectMember.projectId) {
      throw boom.notFound(
        'The member to be removed to the card does not belong to the project',
      );
    }

    const cardMembers = await this.getCardMembers(cardId);
    const cardMemberToBeAdded = cardMembers?.find(
      (cardMember) => cardMember.projectMemberId === projectMemberId,
    );

    if (!cardMemberToBeAdded?.id) {
      throw boom.conflict(
        'The project member to be removed from the card does not exist on the card',
      );
    }

    return this.deleteCardMemberUseCase.execute(cardId, projectMemberId);
  }

  async getProjectMemberById(projectMemberId) {
    return this.getMemberByIdUseCase.execute(projectMemberId);
  }
}

module.exports = CardMemberService;
