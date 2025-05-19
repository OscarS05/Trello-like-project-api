const boom = require('@hapi/boom');

const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMemberByCardUseCase {
  constructor({ cardRepository, projectMemberRepository }) {
    this.cardRepository = cardRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, cardId) {
    const card = await this.cardRepository.findOneByIdWithList(cardId);
    if (!card?.id) throw boom.notFound('Card not found');
    const projectMember =
      await this.projectMemberRepository.getProjectMemberByCard(userId, card);
    return new ProjectMemberDto(projectMember);
  }
}

module.exports = GetProjectMemberByCardUseCase;
