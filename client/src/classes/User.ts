class User {
  private _login: string;
  private _email: string;
  private _isAdmin: boolean;

  constructor(login: string, email: string, isAdmin: boolean) {
    this._login = login;
    this._email = email;
    this._isAdmin = isAdmin;
  }

  get login(): string {
    return this._login;
  }

  set login(newLogin: string) {
    this._login = newLogin;
  }

  get email(): string {
    return this._email;
  }

  set email(newEmail: string) {
    this._email = newEmail;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
}

export default User;