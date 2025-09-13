// src/database/seeders/production/categories.seeder.ts
import { CashFlowCategory } from '@/src/modules/finance/cash-flow-categories/entities/cash-flow-category.entity'
import { Logger } from '@nestjs/common'
import { DataSource, DeepPartial } from 'typeorm'

const logger = new Logger('CashFlowCategoriesSeeder')

export const cashFlowCategoriesSeeder = async (
  dataSource: DataSource
): Promise<void> => {
  logger.log('Starting cash flow categories seeder')
  const cashFlowCategoryRepo = dataSource.getRepository(CashFlowCategory)

  const cashFlowCategories: DeepPartial<CashFlowCategory>[] = [
    {
      name: 'Comunicación y PC',
      sort: 10,
      categoryChildren: [
        {
          name: 'Internet',
          sort: 15
        },
        {
          name: 'Celular',
          sort: 15
        },
        {
          name: 'Software, apps, juegos',
          sort: 15
        }
      ],
      enabled: true
    },
    {
      name: 'Compras',
      sort: 30,
      categoryChildren: [
        {
          name: 'Ropa y calzado',
          sort: 35
        },
        {
          name: 'Farmacia',
          sort: 35
        },
        {
          name: 'Electrónica, accesorios',
          sort: 35
        },
        {
          name: 'Tiempo libre',
          sort: 35
        },
        {
          name: 'Diversión y regalos',
          sort: 35
        },
        {
          name: 'Salud y belleza',
          sort: 35
        },
        {
          name: 'Casa y jardín',
          sort: 35
        },
        {
          name: 'Joyería, accesorios',
          sort: 35
        },
        {
          name: 'Niños',
          sort: 35
        },
        {
          name: 'Animales, mascotas',
          sort: 35
        },
        {
          name: 'Herramientas y oficina',
          sort: 35
        }
      ],
      enabled: true
    },
    {
      name: 'Hogar',
      sort: 50,
      categoryChildren: [
        {
          name: 'Energía, servicios básicos',
          sort: 55
        },
        {
          name: 'Mantenimiento, reparaciones',
          sort: 55
        },
        {
          name: 'Seguro de propiedad',
          sort: 55
        },
        {
          name: 'Alquiler',
          sort: 55
        },
        {
          name: 'Servicios privados',
          sort: 55
        }
      ],
      enabled: true
    },
    {
      name: 'Alimentos y bebidas',
      sort: 70,
      categoryChildren: [
        {
          name: 'Bar, cafe',
          sort: 75
        },
        {
          name: 'Comestibles',
          sort: 75
        },
        {
          name: 'Restaurantes, fast-food',
          sort: 75
        }
      ],
      enabled: true
    },
    {
      name: 'Transportación',
      sort: 90,
      categoryChildren: [
        {
          name: 'Viajes de negocios',
          sort: 95
        },
        {
          name: 'Viajes largos',
          sort: 95
        },
        {
          name: 'Transporte público',
          sort: 95
        },
        {
          name: 'Taxi',
          sort: 95
        }
      ],
      enabled: true
    },
    {
      name: 'Vida y entretenimiento',
      sort: 110,
      categoryChildren: [
        {
          name: 'Deporte activo, fitness',
          sort: 115
        },
        {
          name: 'Alcohol, tabaco',
          sort: 115
        },
        {
          name: 'Libros, audio, suscripciones',
          sort: 115
        },
        {
          name: 'Caridad, regalos',
          sort: 115
        },
        {
          name: 'Cultura, eventos deportivos',
          sort: 115
        },
        {
          name: 'Educación, desarrollo',
          sort: 115
        },
        {
          name: 'Salud, doctor',
          sort: 115
        },
        {
          name: 'Hobbies',
          sort: 115
        },
        {
          name: 'Vacaciones, viajes, hoteles',
          sort: 115
        },
        {
          name: 'Eventos de vida',
          sort: 115
        },
        {
          name: 'Sorteos, juegos',
          sort: 115
        },
        {
          name: 'TV, Streaming',
          sort: 115
        },
        {
          name: 'Bienestar, belleza',
          sort: 115
        }
      ],
      enabled: true
    },
    {
      name: 'Gastos financieros',
      sort: 130,
      categoryChildren: [
        {
          name: 'Asesoría',
          sort: 135
        },
        {
          name: 'Cargos, cuotas',
          sort: 135
        },
        {
          name: 'Apoyo familiar',
          sort: 135
        },
        {
          name: 'Multas',
          sort: 135
        },
        {
          name: 'Seguros',
          sort: 135
        },
        {
          name: 'Préstamos, intereses',
          sort: 135
        },
        {
          name: 'Impuestos',
          sort: 135
        }
      ],
      enabled: true
    },
    {
      name: 'Inversiones',
      sort: 150,
      categoryChildren: [
        {
          name: 'Collections',
          sort: 155
        },
        {
          name: 'Inversiones financieras',
          sort: 155
        },
        {
          name: 'Inmobiliaria',
          sort: 155
        },
        {
          name: 'Ahorro',
          sort: 155
        }
      ],
      enabled: true
    },
    {
      name: 'Ingresos',
      sort: 170,
      categoryChildren: [
        {
          name: 'Cheques, cupones',
          sort: 175
        },
        {
          name: 'Cuotas y subvenciones',
          sort: 175
        },
        {
          name: 'Regalos',
          sort: 175
        },
        {
          name: 'Intereses, dividendos',
          sort: 175
        },
        {
          name: 'Préstamos, renting',
          sort: 175
        },
        {
          name: 'Sorteos, juegos',
          sort: 175
        },
        {
          name: 'Reembolsos (impuestos, compras)',
          sort: 175
        },
        {
          name: 'Rentas',
          sort: 175
        },
        {
          name: 'Venta',
          sort: 175
        },
        {
          name: 'Sueldo, factura',
          sort: 175
        }
      ],
      enabled: true
    },
    {
      name: 'Otros',
      sort: 190,
      categoryChildren: [
        {
          name: 'Faltante',
          sort: 195
        },
        {
          name: 'Balance',
          sort: 195
        }
      ],
      enabled: true
    }
  ]

  await cashFlowCategoryRepo.save(cashFlowCategories, { transaction: true })
  logger.log('Cash flow categories seeder finished')
}
