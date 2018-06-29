export class User {
  constructor(public email: string, public username: string, public address: string = '', public phone: string = '', public password: string = '', public roles: string[] = ['user']) {};

  getEmail() {
    return this.email;
  }

  getUsername() {
    return this.username;
  }

  getAddress() {
    return this.address;
  }

  getPhone() {
    return this.phone;
  }

  getPassword() {
    return this.password;
  }

  getRoles() {
    return this.roles;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  addRole(role: string) {
    this.roles.push(role);
  }
}
