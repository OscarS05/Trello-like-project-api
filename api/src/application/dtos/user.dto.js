class UserDto {
  constructor({ id, name, email, role, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}

module.exports = UserDto;
