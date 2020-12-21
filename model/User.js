function User(id, username, email, lastName, firstName, cap, city, province) {
    this.id = id || null;
    this.username = username || null;
    this.email = email || null;
    this.lastName = lastName || null;
    this.firstName = firstName || null;
    this.cap = cap || null;
    this.city = city || null;
    this.province = province || null;
}

function UserNoId(username, email, lastName, firstName, cap, city, province) {
    this.username = username || null;
    this.email = email || null;
    this.lastName = lastName || null;
    this.firstName = firstName || null;
    this.cap = cap || null;
    this.city = city || null;
    this.province = province || null;
}

module.exports = {
    User : User,
    UserNoId: UserNoId
}