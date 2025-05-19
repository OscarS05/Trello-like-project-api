const CardMemberDto = require('../../dtos/card-member.dto');

class GetAllCardMembersUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId) {
    const cardMembers = await this.cardMemberRepository.findAll(cardId);
    return cardMembers.map((member) => new CardMemberDto(member));
  }
}

module.exports = GetAllCardMembersUseCase;
