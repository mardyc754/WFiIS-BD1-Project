const { Pool }= require('pg');
let pool;
let config = {
	user: 'yoezryfk',
	database: 'yoezryfk',
	password: 'v_Avdac0AUoK7ww4hk2DiLOfLKXWZLbV',
	port: 5432,
	host: 'ella.db.elephantsql.com',
}

module.exports = {
  connect: function() {
    if(pool) return pool;
    pool = new Pool(config);
    return pool;
  }
}