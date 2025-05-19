const { User, UserSchema } = require('./user.model');
const {
  WorkspaceMember,
  WorkspaceMemberSchema,
} = require('./workspace-member.model');
const { Workspace, WorkspaceSchema } = require('./workspace.model');
const { Team, TeamSchema } = require('./team.model');
const { TeamMember, TeamMemberSchema } = require('./team-member.model');
const {
  ProjectMember,
  ProjectMemberSchema,
} = require('./project-member.model');
const { Project, ProjectSchema } = require('./project.model');
const { ProjectTeam, ProjectTeamSchema } = require('./project-team.model');
const { List, ListSchema } = require('./list.model');
const { Card, CardSchema } = require('./card.model');
const { CardMember, CardMemberSchema } = require('./card-member.model');
const {
  CardAttachment,
  CardAttachmentSchema,
} = require('./card-attachment.model');
const { Checklist, ChecklistSchema } = require('./checklist.model');
const {
  ChecklistItem,
  ChecklistItemSchema,
} = require('./checklist-item.model');
const {
  ChecklistItemMember,
  ChecklistItemMemberSchema,
} = require('./checklist-item-members.model');
const { Label, LabelSchema } = require('./label.model');
const { CardLabel, CardLabelSchema } = require('./card-labels.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Workspace.init(WorkspaceSchema, Workspace.config(sequelize));
  WorkspaceMember.init(
    WorkspaceMemberSchema,
    WorkspaceMember.config(sequelize),
  );
  Team.init(TeamSchema, Team.config(sequelize));
  TeamMember.init(TeamMemberSchema, TeamMember.config(sequelize));
  Project.init(ProjectSchema, Project.config(sequelize));
  ProjectMember.init(ProjectMemberSchema, ProjectMember.config(sequelize));
  ProjectTeam.init(ProjectTeamSchema, ProjectTeam.config(sequelize));
  List.init(ListSchema, List.config(sequelize));
  Card.init(CardSchema, Card.config(sequelize));
  CardMember.init(CardMemberSchema, CardMember.config(sequelize));
  CardAttachment.init(CardAttachmentSchema, CardAttachment.config(sequelize));
  Checklist.init(ChecklistSchema, Checklist.config(sequelize));
  ChecklistItem.init(ChecklistItemSchema, ChecklistItem.config(sequelize));
  ChecklistItemMember.init(
    ChecklistItemMemberSchema,
    ChecklistItemMember.config(sequelize),
  );
  Label.init(LabelSchema, Label.config(sequelize));
  CardLabel.init(CardLabelSchema, CardLabel.config(sequelize));

  User.associate(sequelize.models);
  Workspace.associate(sequelize.models);
  WorkspaceMember.associate(sequelize.models);
  Team.associate(sequelize.models);
  TeamMember.associate(sequelize.models);
  Project.associate(sequelize.models);
  ProjectMember.associate(sequelize.models);
  List.associate(sequelize.models);
  Card.associate(sequelize.models);
  CardMember.associate(sequelize.models);
  CardAttachment.associate(sequelize.models);
  Checklist.associate(sequelize.models);
  ChecklistItem.associate(sequelize.models);
  ChecklistItemMember.associate(sequelize.models);
  Label.associate(sequelize.models);
  CardLabel.associate(sequelize.models);
}

module.exports = setupModels;
