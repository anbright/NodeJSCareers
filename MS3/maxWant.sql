## For F, instead of days with highest user, we decided to find company with highest interest. We figured it 
## didn't matter as much which days had users 

WITH TEMP AS (SELECT COMPANYNAME, COUNT(*) AS WANT FROM INTEREST GROUP BY COMPANYNAME ORDER BY WANT desc) 
SELECT * FROM TEMP WHERE TEMP.WANT = (SELECT MAX(WANT) FROM TEMP)