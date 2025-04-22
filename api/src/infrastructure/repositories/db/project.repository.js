const boom = require('@hapi/boom');
const IProjectRepository = require('../../../domain/repositories/db/IProjectRepository');

class ProjectRepository extends IProjectRepository{
  constructor(db){
    super();
    this.db = db;
  }

  async create(projectEntity, projectMemberEntity){
    const transaction = await this.db.transaction();
    try {
      const project = await this.db.models.Project.create(projectEntity, { transaction });
      await this.db.models.ProjectMember.create(projectMemberEntity, { transaction });
      await transaction.commit();

      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(projectId, projectUpdateEntity){
    return await this.db.models.Project.update(projectUpdateEntity, {
      where: { id: projectId },
      returning: true,
    });
  }

  async delete(projectId){
    return await this.db.models.Project.destroy({ where: { id: projectId } });
  }

  async findById(projectId){
    return await this.db.models.Project.findOne({ where: { id: projectId } });
  }

  async findAllByWorkspace(workspaceId){
    return await this.db.models.Project.findAll({
      where: { workspaceId }
    });
  }

  async getAllProjectInformation(projectId){
    return await this.db.models.Project.findOne({
      where: { id: projectId },
      attributes: ['id', 'name', 'visibility', 'backgroundUrl'],
      include: [
        {
          model: this.db.models.List,
          as: 'lists',
          include: [
            {
              model: this.db.models.Card,
              as: 'cards',
              include: [
                {
                  model: this.db.models.ProjectMember,
                  as: 'members',
                  attributes: ['id'],
                  required: false,
                  include: [
                    {
                      model: this.db.models.WorkspaceMember,
                      as: 'workspaceMember',
                      include: [
                        {
                          model: this.db.models.User,
                          as: 'user',
                          attributes: ['id', 'name', 'email']
                        }
                      ]
                    }
                  ]
                },
                {
                  model: this.db.models.Label,
                  as: 'labels',
                  required: false,
                  attributes: ['id', 'name', 'color'],
                  through: { where: { isVisible: true } }
                },
                {
                  model: this.db.models.CardAttachment,
                  as: 'attachments',
                  required: false,
                  attributes: ['filename']
                },
                {
                  model: this.db.models.Checklist,
                  as: 'checklists',
                  attributes: ['id', 'name'],
                  include: [
                    {
                      model: this.db.models.ChecklistItem,
                      as: 'items',
                      attributes: ['name', 'isChecked']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async findAllByWorkspaceMember(workspaceId, workspaceMemberId){
    const projects = await this.db.models.Project.findAll({
      where: { workspaceId },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMembers',
          required: true,
          where: { workspaceMemberId },
          attributes: []
        }
      ],
      attributes: ['id', 'name']
    });

    const projectIds = projects.map(p => p.id);
    if (projectIds.length === 0) return [];

    return await this.db.models.Project.findAll({
      where: { id: projectIds },
      include: [{ model: this.db.models.ProjectMember, as: 'projectMembers'}]
    });
  }

  async countProjects(workspaceMemberId){
    return await this.db.models.ProjectMember.count(
      { where: { workspaceMemberId } }
    )
  }
}

module.exports = ProjectRepository;
