const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectMemberDto = require('../../dtos/projectMember.dto');

class AssignProjectUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  // The main idea is: Assign a team to a project
  async execute(teamMembers, projectMembers, teamId, projectId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!projectId) throw new Error('projectId was not provided');
    if (!Array.isArray(teamMembers)) {
      throw new Error('teamMembers provided is not an array');
    }
    if (!Array.isArray(projectMembers)) {
      throw new Error('projectMembers provided is not an array');
    }

    const assignedProject = await this.teamRepository.assignProject(
      teamId,
      projectId,
    );

    if (!assignedProject?.teamId || !assignedProject?.projectId) {
      throw new Error('Something went wrong assigning the team to the project');
    }

    const nonProjectTeamMembers = teamMembers.filter(
      (teamMember) =>
        !projectMembers.some(
          (projectMember) =>
            projectMember.workspaceMemberId === teamMember.workspaceMemberId,
        ),
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

    if (addedMembers?.length === 0) {
      throw new Error('Something went wrong adding the new project members');
    }

    return {
      assignedProject,
      addedMembers: addedMembers.map((member) => new ProjectMemberDto(member)),
    };
  }
}

module.exports = AssignProjectUseCase;
