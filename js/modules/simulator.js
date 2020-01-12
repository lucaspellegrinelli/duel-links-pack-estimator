import { CardPack } from './cardpack.js';

export function Simulator(boxes_cards, iterations){
  this.boxes_cards = boxes_cards;
  this.iterations = iterations;

  this.run = function(percentage_callback){
    let start_sim_time = new Date().getTime();
    let simulated = [];

    for(let i = 0; i < this.iterations; i++){
      if(i % Math.trunc(this.iterations / 25) == 0){
        percentage_callback(i / this.iterations);
      }

      let total_simulated = 0;

      this.boxes_cards.forEach(function(box_info){
        let box = new CardPack(box_info.boxtype);
        total_simulated += box.packs_needed(box_info.cards);
      });

      simulated.push(total_simulated);
    }

    let elapsed_time = (new Date().getTime() - start_sim_time) / 1000;

    return {
      "result": simulated,
      "exectime": elapsed_time
    }
  }
};
