const boom = require('@hapi/boom');

const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMemberByCardUseCase {
  constructor({ cardRepository, projectMemberRepository }) {
    this.cardRepository = cardRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, cardId) {
    if (!userId) throw new Error('userId was not provided');
    if (!cardId) throw new Error('cardId was not provided');

    const card = await this.cardRepository.findOneByIdWithList(cardId);

    if (!card?.id) throw boom.notFound('Card not found');

    const projectMember =
      await this.projectMemberRepository.getProjectMemberByCard(userId, card);

    return projectMember?.id ? new ProjectMemberDto(projectMember) : {};
  }
}

module.exports = GetProjectMemberByCardUseCase;
