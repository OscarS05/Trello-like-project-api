class ProjectMemberDto {
  constructor({ id, workspaceMemberId, workspaceMember, projectId, role, addedAt }) {
    this.id = id;
    this.name = workspaceMember?.user?.name;
    this.workspaceMemberId = workspaceMemberId;
    this.projectId = projectId;
    this.role = role;
    this.addedAt = addedAt
  }

  static withProject(projectMember){
    const ProjectDto = require('./project.dto');

    return {
      id: projectMember.id,
      workspaceMemberId: projectMember.workspaceMemberId,
      projectId: projectMember.projectId,
      role: projectMember.role,
      project: new ProjectDto(projectMember.project),
    }
  }

  static fromModel(projectMember, teams){
    return {
      id: projectMember.id,
      name: projectMember.workspaceMember.user.name,
      workspaceMemberId: projectMember.workspaceMember.id,
      projectId: projectMember.projectId,
      role: projectMember.role,
      teams: teams
        .filter(team => team.teamMembers.some(tm => tm.workspaceMemberId === projectMember.workspaceMemberId))
        .map(team => ({
          id: team.id,
          name: team.name,
        }))
    };
  }
}

module.exports = ProjectMemberDto;
