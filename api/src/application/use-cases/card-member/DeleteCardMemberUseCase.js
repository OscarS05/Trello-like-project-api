class DeleteCardMemberUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, projectMemberId) {
    if (!cardId) throw new Error('cardId was not provided');
    if (!projectMemberId) throw new Error('projectMemberId was not provided');

    const result = await this.cardMemberRepository.delete(
      cardId,
      projectMemberId,
    );

    if (result === 0) {
      throw new Error('Something went wrong deleting the card member');
    }

    return result;
  }
}

module.exports = DeleteCardMemberUseCase;
