function ZipCode(cap, city, province){
    this.cap = cap || null;
    this.city = city || null;
    this.province = province || null;
}

module.exports = {
    ZipCode: ZipCode
};