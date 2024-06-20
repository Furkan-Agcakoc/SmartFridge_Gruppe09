// import BusinessObject from './BusinessObject';

// /**
//  * Represents a Inhabitant object.
//  */
// export default class InhabitantBO extends BusinessObject {
//   constructor() {
//     super();
//     // Hier kannst du weitere Eigenschaften der Klasse definieren
//   }

//   static fromJSON(inhabitantData) {
//     let result = [];
//     if (Array.isArray(inhabitantData)) {
//       inhabitantData.forEach((elem) => {
//         Object.setPrototypeOf(elem, InhabitantBO.prototype);
//         result.push(elem);
//       });
//     } else {
//       // Falls es kein Array ist, konvertiere das Objekt
//       Object.setPrototypeOf(inhabitantData, InhabitantBO.prototype);
//       result.push(inhabitantData);
//     }
//     return result;
//   }
// }
