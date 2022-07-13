function nbYear(p0, percent, aug, p) {
	  let years = 0
	  while (p0 < p) {
		      const exponentialGrowth = Math.floor(p0 * percent / 100)
		      p0 += exponentialGrowth + aug
		      years++
		    }
	  return years
}

// https://www.codewars.com/kata/563b662a59afc2b5120000c6
