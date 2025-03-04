import {prisma} from '@/lib/prisma'

async function main() {
    await prisma.category.createMany({
        data: [
            {name: "Fantasia"},  {name: "Acción"}
        ]
    })
    await prisma.book.createMany({
        data: [
            {title: "Alicia en el País de las Maravillas", author: "Lewis Carroll", resume: "Alicia, una niña curiosa, sigue a un conejo blanco que lleva un reloj de bolsillo y cae en una madriguera, transportándose a un mundo fantástico. En su viaje, conoce personajes extravagantes como el Sombrerero Loco, la Liebre de Marzo, la Oruga Azul y la Reina de Corazones. A través de situaciones ilógicas y reglas absurdas, Alicia desafía la lógica del mundo adulto antes de despertar y darse cuenta de que todo fue un sueño.", description: "Páginas: 256. Edición: Tapa dura con ilustraciones clásicas. Calidad: Excelente encuadernación con papel grueso y letras doradas en la portada, ideal para coleccionistas.", price: 30000, stock: 12, categoryId: 'c8eb1c37-a177-4a29-a29d-a84e89569d18'},
            {title: "Red de mentiras", author: "David Ignatius", resume: "Roger Ferris, un agente de la CIA con experiencia en Medio Oriente, diseña un plan para infiltrar a un líder terrorista usando una falsa red de inteligencia. Inspirado en una estrategia británica de la Segunda Guerra Mundial, crea un espía ficticio para sembrar desinformación. Sin embargo, la manipulación de aliados, la traición interna y la brutalidad del enemigo ponen en peligro su misión y su vida. A medida que la verdad y la mentira se entrelazan, Ferris debe decidir en quién confiar en un mundo donde nada es lo que parece.", description:"Páginas: 448. Edición: Rústica con solapas impreso en papel de buena calidad. Calidad: Excelente impresión con tinta resistente, encuadernación sólida y traducción precisa para una lectura inmersiva.", price: 22000, stock: 4, categoryId: '5b981ced-442a-48b1-a248-dbde40a651b0'}
        ]
    })
}

main()
.catch(e => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})