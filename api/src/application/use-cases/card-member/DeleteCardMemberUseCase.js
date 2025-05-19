class DeleteCardMemberUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, projectMemberId) {
    return this.cardMemberRepository.delete(cardId, projectMemberId);
  }
}

module.exports = DeleteCardMemberUseCase;
