import client from './client';

//모든 채널들을 가져옵니다.
export const getAllChannels = () => {
  return client.get('/api/channels');
};

//해당 채널에 속하는 parent 메뉴들을 가져옵니다
export const getChannelParentMenu = (channelId: string) => {
  return client.get(`/api/channelmenus/${channelId}`);
};

export const getChildMenu = (menuId: string) => {
  return client.get(`/api/menus/parent/${menuId}`);
};

export const getProductsFromMenu = (
  channelId: string,
  menuId: string | null,
  page: number,
) => {
  return client.get(`/api/products/${page}`, {
    params: { channelNo: channelId, menuId: menuId },
  });
};

//프로덕트 id로 해당 프로덕트를 가져옵니다.
export const getProduct = (productId: string) => {
  return client.get(`/api/products/${productId}`);
};

//현재시간을 data로 보내서 조회수를 증가시킨다.
//찜기능은 어떻게?
export const viewPatchProduct = (productId: string) => {
  const date = new Date();
  const time = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(date);

  return client.patch(`/api/products/${productId}`, {
    data: { time: time, type: 'view' },
  });
};


//차트페이지에서 상품의 시간별 조회 정보를 가져옵니다.


//차트페이지에서 상품의 시간별 찜 정보를 가져옵니다.
