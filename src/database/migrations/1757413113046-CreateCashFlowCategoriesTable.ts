import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCashFlowCategoriesTable1757413113046
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS cash_flow_categories (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        icon VARCHAR(255),
        color VARCHAR(100),
        sort INT DEFAULT 5,
        color_type ENUM('CLASS', 'STYLE') DEFAULT 'STYLE',
        category_father_id BIGINT DEFAULT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_father_id) REFERENCES cash_flow_categories(id) ON DELETE RESTRICT
      );
    `
    await queryRunner.query(query)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(10, 'Comunicación y PC', NULL, NULL, 10)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Internet', NULL, 15, 10),
      ('Celular', NULL, 15, 10),
      ('Software, apps, juegos', NULL, 15, 10)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(30, 'Compras', NULL, NULL, 30)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Ropa y calzado', NULL, 35, 30),
      ('Farmacia', NULL, 35, 30),
      ('Electrónica, accesorios', NULL, 35, 30),
      ('Tiempo libre', NULL, 35, 30),
      ('Diversión y regalos', NULL, 35, 30),
      ('Salud y belleza', NULL, 35, 30),
      ('Casa y jardín', NULL, 35, 30),
      ('Joyería, accesorios', NULL, 35, 30),
      ('Niños', NULL, 35, 30),
      ('Animales, mascotas', NULL, 35, 30),
      ('Herramientas y oficina', NULL, 35, 30)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(50, 'Hogar', NULL, NULL, 50)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Energía, servicios básicos', NULL, 55, 50),
      ('Mantenimiento, reparaciones', NULL, 55, 50),
      ('Seguro de propiedad', NULL, 55, 50),
      ('Alquiler', NULL, 55, 50),
      ('Servicios privados', NULL, 55, 50)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(70, 'Alimentos y bebidas', NULL, NULL, 70)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Bar, cafe', NULL, 75, 70),
      ('Comestibles', NULL, 75, 70),
      ('Restaurantes, fast-food', NULL, 75, 70)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(90, 'Transportación', NULL, NULL, 90)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Viajes de negocios', NULL, 95, 90),
      ('Viajes largos', NULL, 95, 90),
      ('Transporte público', NULL, 95, 90),
      ('Taxi', NULL, 95, 90)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(110, 'Vida y entretenimiento', NULL, NULL, 110)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Deporte activo, fitness', NULL, 115, 110),
      ('Alcohol, tabaco', NULL, 115, 110),
      ('Libros, audio, suscripciones', NULL, 115, 110),
      ('Caridad, regalos', NULL, 115, 110),
      ('Cultura, eventos deportivos', NULL, 115, 110),
      ('Educación, desarrollo', NULL, 115, 110),
      ('Salud, doctor', NULL, 115, 110),
      ('Hobbies', NULL, 115, 110),
      ('Vacaciones, viajes, hoteles', NULL, 115, 110),
      ('Eventos de vida', NULL, 115, 110),
      ('Sorteos, juegos', NULL, 115, 110),
      ('TV, Streaming', NULL, 115, 110),
      ('Bienestar, belleza', NULL, 115, 110)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(130, 'Gastos financieros', NULL, NULL, 130)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Asesoría', NULL, 135, 130),
      ('Cargos, cuotas', NULL, 135, 130),
      ('Apoyo familiar', NULL, 135, 130),
      ('Multas', NULL, 135, 130),
      ('Seguros', NULL, 135, 130),
      ('Préstamos, intereses', NULL, 135, 130),
      ('Impuestos', NULL, 135, 130)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(150, 'Inversiones', NULL, NULL, 150)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Collections', NULL, 155, 150),
      ('Inversiones financieras', NULL, 155, 150),
      ('Inmobiliaria', NULL, 155, 150),
      ('Ahorro', NULL, 155, 150)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(170, 'Ingresos', NULL, NULL, 170)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Cheques, cupones', NULL, 175, 170),
      ('Cuotas y subvenciones', NULL, 175, 170),
      ('Regalos', NULL, 175, 170),
      ('Intereses, dividendos', NULL, 175, 170),
      ('Préstamos, renting', NULL, 175, 170),
      ('Sorteos, juegos', NULL, 175, 170),
      ('Reembolsos (impuestos, compras)', NULL, 175, 170),
      ('Rentas', NULL, 175, 170),
      ('Venta', NULL, 175, 170),
      ('Sueldo, factura', NULL, 175, 170)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(id, name, icon, color, sort)
      VALUES(190, 'Otros', NULL, NULL, 99999)
    `)

    await queryRunner.query(`/* SQL */
      INSERT INTO cash_flow_categories(name, icon, sort, category_father_id) VALUES
      ('Faltante', NULL, 195, 190),
      ('Balance', NULL, 195, 190)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      DROP TABLE IF EXISTS cash_flow_categories;
    `
    await queryRunner.query(query)
  }
}
