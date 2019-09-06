// const showName = (name) => {
//     return new Promise((resolve, reject) => {
//         if(name == 'Mauricio') {
//             return resolve(`O nome dele é ${name}`);
//         }
//         reject(new Error('Nome inválido'));
//     });
// }

// const init = async () => {
//     const produtos = await showName('Maurici');
//     const produtosFormatados = await formataProdutos(produtos);
// }

// init();

const obj = {
    id: 1,
    name: 'dasdasda'
}

const { id, name } = obj; 

console.log(id);
console.log(name);
