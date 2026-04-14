let sites = [
    { id: 1, name: 'The Grand Estate', address: '123 Maple Street', published: true, popular: true, active: true },
  ];
  export const list = async () => sites;
  export const markSold = (id) => {
    const s = sites.find(x => x.id === id);
    if (s) s.active = false;
  };
  export const reviewQueue = [];
  export const publish = (id) => {
    const idx = reviewQueue.findIndex(x => x.id === id);
    if (idx > -1) {
      const [s] = reviewQueue.splice(idx, 1);
      s.published = true;
      s.active = true;
      sites.push(s);
    }
  };