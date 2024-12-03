/** 
 * Project-wide Settings 
 */

export const settings = {
    random : {
        randomState : 1234567890,
        coordMin    : -100,
        coordMax    : 100
    },
    search : {
        pointCount  : 10000, 
        dimCount    : 2,
        target      : 50,
        queryCount  : 10, 
        measure     : "negative-euclidean"
    }
}