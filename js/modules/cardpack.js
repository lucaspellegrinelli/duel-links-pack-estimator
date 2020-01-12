const MAIN_BOX = 0
const MINI_BOX = 1
const UR = 0
const SR = 1

export function CardPack(pack_type){
  this.pack_type = pack_type;

  this.cards_in_pack = this.pack_type == MINI_BOX ? 100 : 180

  // Returns the amount of a specific card contained in a specific box
  this.amount_in_pack = function(card){
    if(this.pack_type == MINI_BOX){
      return 1;
    }else{
      return card.type == UR ? 1 : 2;
    }
  }

  // Returns how many packs were needed to get all cards wanted from a random
  // box opening simulation
  this.packs_needed = function(wanted_){
    let wanted = wanted_.map(a => ({...a}));
    let ctx = this;
    let n_packs = 0;

    // How many cards of each of the wanted one's are in each box
    let amount = [];
    wanted.forEach(function(item){
      amount.push(ctx.amount_in_pack(item));
    });

    // Number of boxes needed to fulfill all wanted cards
    let packs_needed_per_card = [];
    wanted.forEach(function(card, i){
      packs_needed_per_card.push(Math.ceil(card.amount / amount[i]))
    });
    let max_packs = Math.max(...packs_needed_per_card);

    // Defines basically how many cards will be forced to be drawn from the current box.
    function pack(card, amt_in_box, curr_pack){
      return card.pos[card.amount - (amt_in_box * (max_packs - curr_pack - 1)) - 1];
    };

    // Checks is there's need to force draw this card from the current box
    function check(card, amt_in_box, curr_pack){
      return Math.ceil(card.amount / amt_in_box) == (max_packs - curr_pack);
    };

    // Shuffles an array
    function shuffle(o) {
      for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };

    // Foreach pack we start drawing cards
    for(let p = 0; p < max_packs; p++){
      // Define the positions of all cards we want in it
      let cards_id = [];
      for(let c = 0; c < this.cards_in_pack; cards_id.push(c++));
      let positions = shuffle(cards_id).slice(amount.reduce((a, b) => a + b, 0));

      wanted.forEach(function(card, index){
        wanted[index]["pos"] = [];
        for(let i = 0; i < amount[index]; i++, wanted[index].pos.push(positions.pop()));
      });

      // Defines which will be the last pack we'll need to open to get all
      // cards we sould get in the current pack
      let possible_last_packs = [];
      wanted.forEach(function(card, i){
        if(check(card, amount[i], p)){
          possible_last_packs.push(pack(card, amount[i], p));
        }
      });
      let last_pack = Math.max(...possible_last_packs);
      n_packs += last_pack + 1;

      // Updates number of each card left
      wanted.forEach(function(card, i){
        let opened_cards_count = 0;
        card.pos.forEach(function(item){
          if(item <= last_pack) opened_cards_count++;
        });

        wanted[i].amount -= opened_cards_count;
        wanted[i].amount = Math.max(0, wanted[i].amount);
      });
    }

    return n_packs;
  }
};
