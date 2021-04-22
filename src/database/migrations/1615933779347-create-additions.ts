import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createAdditions1615933779347 implements MigrationInterface {
  private table = new Table({
    name: 'additions',
    columns: [
      {
        name: 'id',
        isPrimary: true,
        isNullable: false,
        isGenerated: true,
        generationStrategy: 'uuid',
        type: 'uuid',
      },
      {
        name: 'description',
        type: 'varchar',
        length: '100',
        isNullable: false,
      },
      {
        name: 'price',
        type: 'float',
        isNullable: false,
      },
      {
        name: 'restaurant_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
    ],
  });

  private restaurant_fk = new TableForeignKey({
    columnNames: ['restaurant_id'],
    referencedTableName: 'restaurants',
    onDelete: 'CASCADE',
    referencedColumnNames: ['id'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.restaurant_fk);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
