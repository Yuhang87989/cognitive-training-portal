/* 数据库统一导出
 * 整合所有数据库模块，便于外部使用
 */

import { default as database } from './database/index.js';
import { default as userDB } from './database/user-db.js';
import { default as questionDB } from './database/question-db.js';
import { default as libraryDB } from './database/library-db.js';
import { default as deepseekDB } from './database/deepseek-db.js';

export { database };
export { userDB };
export { questionDB };
export { libraryDB };
export { deepseekDB };

export default {
    database,
    user: userDB,
    question: questionDB,
    library: libraryDB,
    deepseek: deepseekDB
};
