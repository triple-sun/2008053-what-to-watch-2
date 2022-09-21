import { Genre } from '../../types/enum/genre.enum.js';
import { TMockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem } from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface.js';
import dayjs from 'dayjs';

const MIN_YEAR = 2010;
const MAX_YEAR = 2021;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: TMockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const published = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem<Genre>(Object.values(Genre));
    const released = generateRandomValue(MIN_YEAR, MAX_YEAR).toString();
    const rating = getRandomItem<number>(this.mockData.ratings).toString();
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLinks);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const starring = getRandomItem<string[]>(this.mockData.starringLists).join(', ');
    const director = getRandomItem<string>(this.mockData.directors);
    const runTime = getRandomItem<number>(this.mockData.runTimes).toString();
    const commentsCount = getRandomItem<number>(this.mockData.commentCounts).toString();
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarUrl = getRandomItem<string>(this.mockData.avatarUrls);
    const password = getRandomItem<string>(this.mockData.passwords);
    const posterImage = getRandomItem<string>(this.mockData.posterImages);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
      title, description, published, genre,
      released, rating, previewVideoLink, videoLink,
      starring, director, runTime, commentsCount,
      name, email, avatarUrl, password, posterImage,
      backgroundImage, backgroundColor
    ].join('\t');
  }
}
