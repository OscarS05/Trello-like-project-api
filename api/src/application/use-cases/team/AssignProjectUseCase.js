const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectMemberDto = require('../../dtos/projectMember.dto');

class AssignProjectUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(teamMembers, projectMembers, teamId, projectId) {
    const nonProjectTeamMembers = teamMembers.filter(
      (teamMember) =>
        !projectMembers.some(
          (projectMember) =>
            projectMember.workspaceMemberId === teamMember.workspaceMemberId,
        ),
    );

    const assignedProject = await this.teamRepository.assignProject(
      teamId,
      projectId,
    );

    if (nonProjectTeamMembers.length === 0)
      return { assignedProject, addedMembers: [] };

    const projectMembersEntity = nonProjectTeamMembers.map(
      (member) =>
        new ProjectMemberEntity({ ...member, role: 'member', projectId }),
    );

    const addedMembers = await Promise.all(
      projectMembersEntity.map((member) =>
        this.projectMemberRepository.create(member),
      ),
    );

    return {
      assignedProject,
      addedMembers: addedMembers.map((member) => new ProjectMemberDto(member)),
    };
  }
}

module.exports = AssignProjectUseCase;
