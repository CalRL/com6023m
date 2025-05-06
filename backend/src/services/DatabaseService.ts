import {RowList} from "postgres";

const DISALLOWED_FIELDS_UPDATE = ['id'];
const DISALLOWED_FIELDS_READ = ['password_hash'];
class DatabaseService {

    async getFields(table: RowList<any>, userId: number, fields: Record<string, boolean>) {

    }

    async updateFields(table: RowList<any>, userId: number, fields: Record<string, boolean>) {

    }

}