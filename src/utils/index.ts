import runTime from './runTime'

/**
 * 得到随机值
 * @param {number} min
 * @param {number} max
 * @param {number}
 */
export function getRandomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 得到当前性能测量开始的时间戳
 * @return {number}
 */
export function getTimeStamp() {
  return performance.now()
}

export default { runTime }
