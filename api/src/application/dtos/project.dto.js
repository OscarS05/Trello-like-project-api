const ListDto = require("./list.dto");
const ProjectMemberDto = require("./projectMember.dto");
const TeamDto = require("./team.dto");

class ProjectDto {
  constructor({ id, name, visibility, backgroundUrl, workspaceId, workspaceMemberId, createdAt, lists }) {
    this.id = id;
    this.name = name;
    this.visibility = visibility;
    this.backgroundUrl = backgroundUrl;
    this.workspaceId = workspaceId;
    this.workspaceMemberId = workspaceMemberId;
    this.createdAt = createdAt;

    if(Array.isArray(lists)){
      this.lists = lists.length > 0 ? lists.map(list =>  new ListDto(list)) : [];
    }
  }

  static withTeams(project){
    return {
      id: project.id,
      name: project.name,
      visibility: project.visibility,
      workspaceId: project.workspaceId,
      workspaceMemberId: project.workspaceMemberId,
      backgroundUrl: project.backgroundUrl || null,
      createdAt: project.createdAt,
      teams: project.teams.map(team => new TeamDto(team)),
    }
  }

  static data(project){
    return {
      id: project.id,
      name: project.name,
      visibility: project.visibility,
      workspaceId: project.workspaceId,
      backgroundUrl: project.backgroundUrl || null,
      workspaceMemberId: project.workspaceMemberId
    }
  }

  static withProjectMembers(project){
    return {
      id: project.id,
      name: project.name,
      visibility: project.visibility,
      workspaceId: project.workspaceId,
      workspaceMemberId: project.workspaceMemberId,
      backgroundUrl: project.backgroundUrl || null,
      createdAt: project.createdAt,
      projectMembers: project.projectMembers.map(member => new ProjectMemberDto(member)),
    }
  }

  static fromEntity(project){
    return {
      id: project.id,
      name: project.name,
      visibility: project.visibility,
      workspaceId: project.workspaceId,
      backgroundUrl: project.backgroundUrl,
      access: project.access || false,
    }
  }
}

module.exports = ProjectDto;
