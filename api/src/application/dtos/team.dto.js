const TeamMemberDto = require('../dtos/teamMember.dto');

const ACTIONS = {
  MEMBER: [ "leave_team" ],
  ADMIN: [ "remove_member", "change_role", "leave_team", "add_member" ],
  OWNER: [ "remove_member", "change_role", "leave_team", "transfer_ownership", "add_member" ]
}

class TeamDto {
  constructor({ id, name, workspaceMemberId, workspaceId, createdAt }){
    this.id = id;
    this.name = name;
    this.workspaceMemberId = workspaceMemberId;
    this.workspaceId = workspaceId;
    this.createdAt = createdAt;
  }

  static fromModel(team, projectMembers) {
    return {
      id: team.id,
      name: team.name,
      members: team.teamMembers.map(teamMember => ({
        id: teamMember.workspaceMember.id,
        name: teamMember.workspaceMember.user.name,
        role: teamMember.role,
        isMemberProject: projectMembers.some(pm => pm.workspaceMemberId === teamMember.workspaceMemberId)
      }))
    };
  }

  static withMembers(team){
    return {
      id: team.id,
      name: team.name,
      workspaceMemberId: team.workspaceMemberId,
      workspaceId: team.workspaceId,
      members: team.teamMembers.map(member => new TeamMemberDto(member)),
    }
  }

  static WithData(team, requesterAsWorkspaceMember){
    const ProjectDto = require('./project.dto');
    return {
      id: team.id,
      name: team.name,
      owner: this.getOwner(team.teamMembers),
      workspaceId: team.workspaceId,
      members: team.teamMembers.map(member => TeamMemberDto.withName(member)),
      projects: team.projects.map(project => new ProjectDto(project)),
      requesterActions: this.getRequesterActions(team.teamMembers, requesterAsWorkspaceMember),
    }
  }

  static getOwner(members) {
    const owner = members.find(member => member.role === 'owner');
    return owner ? { name: owner.workspaceMember.user.name } : { name: "unknown" };
  }

  static getRequesterActions(members, requesterAsWorkspaceMember){
    const requester = members.find(member => member.workspaceMemberId == requesterAsWorkspaceMember.id);
    if (!requester) return {};

    if (requester.role === 'owner') {
      return {
        status: requester.role,
        canModify: ['admin', 'member'],
        actions: ACTIONS.OWNER
      };
    } else if (requester.role !== 'owner') {
      return {
        status: requester.role,
        canModify: requester.role === 'admin' ? ['member', 'admin'] : [],
        actions: requester.role === 'admin' ? ACTIONS.ADMIN : ACTIONS.MEMBER
      };
    }

    return {};
  }
}

module.exports = TeamDto;
