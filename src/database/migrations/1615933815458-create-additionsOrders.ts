import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createAdditionsOrders1615933815458 implements MigrationInterface {
  private table = new Table({
    name: 'additions_orders_orders',
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
        name: 'ordersProductsProductsId',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'additionsId',
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

  private ordersForeginKey = new TableForeignKey({
    columnNames: ['ordersProductsProductsId'],
    referencedTableName: 'orders_products_products',
    onDelete: 'SET NULL',
    referencedColumnNames: ['id'],
  });

  private additionForeginKey = new TableForeignKey({
    columnNames: ['additionsId'],
    referencedTableName: 'additions',
    onDelete: 'SET NULL',
    referencedColumnNames: ['id'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.additionForeginKey);
    await queryRunner.createForeignKey(this.table, this.ordersForeginKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
