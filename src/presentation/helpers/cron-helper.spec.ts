import { CronHelper } from './cron-helper'

describe('Task Manager Module', () => {
  test('Should return the right cron notation from funcion', () => {
    const sut = new CronHelper()
    expect(sut.every().seconds()).toBe('*/1 * * * * *')
    expect(sut.every().minutes()).toBe('* */1 * * *')
    expect(sut.every().hours()).toBe('0 0/1 * * *')
    expect(sut.every().days().at('00:00')).toBe('0 0 */1 * *')
    expect(sut.daily().at('00:00')).toBe('0 0 */1 * *')
    expect(sut.daily().at('22:00')).toBe('0 22 */1 * *')
    expect(sut.daily().at('asdasd')).toBe('0 0 */1 * *')

    expect(sut.every(5).seconds()).toBe('*/5 * * * * *')
    expect(sut.every(5).minutes()).toBe('* */5 * * *')
    expect(sut.every(5).hours()).toBe('0 0/5 * * *')
    expect(sut.every(5).days().at('00:00')).toBe('0 0 */5 * *')
    expect(sut.daily().at('20:00')).toBe('0 20 */1 * *')
  })
})
