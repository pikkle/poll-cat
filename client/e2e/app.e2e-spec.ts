import { PollCatPage } from './app.po';

describe('poll-cat App', function() {
  let page: PollCatPage;

  beforeEach(() => {
    page = new PollCatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
