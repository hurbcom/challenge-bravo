from main.repository.rate import Rate
from main.app import logger
import aiohttp
import asyncio
import requests
import json

class Sources():

    base_currency = 'USD'

    standard_currencies = ['USD','BRL','EUR','BTC','ETH']

    source_apis = [
        {
            'engine': 'exchangerate',
            'request': {
                'endpoint':'https://api.exchangerate-api.com/v4/latest/USD',
                'headers':{}
            },
            'currencies': ['USD','AED','ARS','AUD','BGN','BRL','BSD','CAD','CHF','CLP','CNY','COP','CZK','DKK','DOP','EGP','EUR','FJD','GBP','GTQ','HKD','HRK','HUF','IDR','ILS','INR','ISK','JPY','KRW','KZT','MVR','MXN','MYR','NOK','NZD','PAB','PEN','PHP','PKR','PLN','PYG','RON','RUB','SAR','SEK','SGD','THB','TRY','TWD','UAH','UYU','ZAR']
        },
        {
            'engine': 'coinapi',
            'request': {
                'endpoint':'https://rest.coinapi.io/v1/exchangerate/USD?invert=true',
                'headers':{'X-CoinAPI-Key':'DA230AC2-841A-4A8C-BA3D-62D637832685'}
            },
            'currencies': ['XTZHALF','XTZBULL','USDTBEAR','XRP','USDT','YOC','XTZ','VRTX','WABI','XEM','WNXM','VOD','XLM','WDC','XDCE','XAUTBULL','VETBULL','XTZBEAR','XRPBEAR','XRPHALF','USDC','USDS','ZEN','ZRX','XNB','ZIL','XAUTBEAR','VETBEAR','USDTBULL','V','XIFA','WAX','ZEC','WLTW','WAVES','XRPBULL','XAUT','USDTHEDGE','XAUTHALF','WRX','WAXP','XTZHEDGE','XZC','USX','VET','XCH','XOM','YOYOW','USDK','VSY','ZBT','WDAY','XVG','YFI','XRPHEDGE','UST','XAUTHEDGE','USDTHALF','VRSN','YFII','XMR','VETHEDGE','WTC','COMP','DRGNBEAR','AUNIT','OKBBEAR','DGX','ADSK','RUNE','OCEAN','CCC','GNO','AVT','SUSHIBULL','AMD','UDC','TOMOHEDGE','GUSD','MNC','OURO','CVS','ANT','PLA','BTMXHALF','TRXHEDGE','LINK','ALTBULL','LINKBULL','REP','NSRGY','LEOBEAR','UFR','NTAP','AMZN','DOGEBULL','PLBT','BAT','UNISWAPBULL','UMA','BIDU','DOGEHEDGE','ANKR','HEDGE','UBS','BCHBULL','EBAY','AKRO','ALTBEAR','BCHABC','TOMOHALF','CHF','LTCHEDGE','CUSD','ATOMHEDGE','CPCN','SXPHALF','BALHALF','PAXG','TRYBBULL','UBXT','IQX','MIDHEDGE','LTC','TOMO','GS','BAL','MATICHEDGE','RVN','TRYBHALF','KAVA','TM','EOSHALF','ETH','ATOM','EUS','CUSDT','LEND','ORLY','QTUM','BNBBULL','HBAR','COMPHEDGE','TRX','REN','RLC','ETHHEDGE','EMC','AMP','CSCO','PAXGBEAR','MATICBULL','ALG','SXPBEAR','ADABEAR','MANA','MKFA','TNT','GBP','HTHALF','PFE','THETAHALF','GNT','STRAT','CHA','EXCHBEAR','TCEHY','ALGOBEAR','BNBBEAR','THETAHEDGE','CHT','NKE','KNCBULL','BVOL','TOMOBULL','LTCBULL','LUA','KHC','TRYB','DB','CNEX','PRIVBEAR','HNT','APH','AIG','ENJ','FDX','KIM','ORAN','SWAT','EDO','GTX','OKBHEDGE','BCC','DMGBEAR','OKBBULL','LINKHEDGE','DGB','HTBEAR','UNI','MKR','SMLY','TRXBULL','PEP','EXCHBULL','BTMXBULL','ATO','PIVX','BSVBEAR','ALTHALF','ADBE','EMR','DEFIBULL','DGLD','BSVHALF','UBXA','PRIVHALF','EUR','CAD','AEP','UNP','JPY','ALGOHEDGE','JST','ADA','THETABULL','TRYBBEAR','JPM','ELF','HYFA','SOL','SOLVE','SNX','HXRO','DOGE','AXP','COMPBULL','HMC','ETCHALF','ADP','ALGOHALF','DEFIBEAR','BMRN','UNISWAPBEAR','BIIB','BOTX','AMAT','NMR','PSX','DUK','FB','FOX','BCHHEDGE','AMPL','MCHP','PMGT','DOGEBEAR','PAXGHALF','CUSDTBEAR','THETABEAR','TUSD','STJ','TFA','ILMN','DMGBULL','MAR','AAPL','HGET','POLIS','SXPBULL','SOLO','ATOMBULL','MCD','ADAHALF','BCHSV','BULL','DIS','ONG','TRUMPLOSE','BNT','BEARSHIT','SC','CVC','MIDHALF','QSH','NEO','ADK','ILC','COST','EXCHHALF','TRYBHEDGE','STORJ','DOGEHALF','LINKBEAR','JNJ','AUD','ONE','ABS','CO2P','DOT','PAX','BRL','KMB','COMPHALF','KNCBEAR','DAI','INTC','DCR','UBNKA','EOSHEDGE','BALHEDGE','SXPHEDGE','SXP','CREAM','COP','MLN','1GOLD','BAND','GAS','PYPL','COMPBEAR','KNCHEDGE','CRV','KEP','LINKHALF','SMART','IP','ALTHEDGE','TNB','ADAHEDGE','REGN','BEAR','PAXGBULL','DMG','CUSDTHEDGE','ULTA','CELO','FTT','POA','MIDBULL','ATOMBEAR','DEFIHALF','NVDA','HALFSHIT','BA','BALBEAR','STAKE','KR','MA','S8','KNCHALF','TRB','HD','AIO','HTHEDGE','FUN','QOOB','TSLA','ETHBEAR','HTBULL','PHG','BNBHALF','DEFIHEDGE','CHZ','DRGNHEDGE','BAC','KMD','BCHHALF','CUSDTHALF','SNG','MATICHALF','CUSDTBULL','LRC','BUSD','DFI','RUB','FET','ROST','HSBC','SNE','BNB','BTMXHEDGE','PLC','SUSHIBEAR','PRIVBULL','SWK','CHU','CME','KSM','KNC','OKBHALF','LTCBEAR','SPGI','ALGOBULL','BTSE','TRI','KEY','OAP','RRT','MS','UBGA','RBTC','MKRBEAR','ALGO','NPSNY','MKRBULL','ULTRA','HDB','ETP','TOMOBEAR','SUSHI','LEOHEDGE','MFG','OXT','MHC','PHNX','LTCHALF','LEOHALF','MATIC','ATVI','BTMX','DASH','ICX','ONT','ADABULL','PAYX','CCI','GOOGL','EIX','BCH','PAXGHEDGE','CRO','BKCAT','TRUMPWIN','RDD','CLO','BTG','BLK','BCB','EXCHHEDGE','DRGNHALF','BCHBEAR','BSVBULL','MSFT','OR.PA','MMM','ALGN','ETHHALF','DATA','BNBHEDGE','PXD','EOS','NWL','EGLD','OMG','MIDBEAR','IBVOL','TSD','TRXHALF','ETC','BABA','AAL','REPV2','HPE','NOK',
'HALF','HOT','NANO','EFA','BDX','REQ','SBUX','ATOMHALF','BTT','CGLD','EOSBEAR','BTC','SRM','LSK','EOSBULL','KO','LEO','BSVHEDGE','LVS','ETHBULL','BALBULL','HIVE','PZM','MTA','HEDGESHIT','LEOBULL','IOTA','BTMXBEAR','MATICBEAR','OXY','SIRI','SNT','DOG','PRIVHEDGE','FRM','NEC','BULLSHIT','TXN','DRGNBULL','BSX','TRXBEAR','LYGA','HPB','INT','BIDR','OKB','GOV','BHD','TKY','ADEL','HPT','LINKDOWN','SUS','DOT3S','KRW','BERRY','ACH','ATP','TFD','BUT','DAG','HMP','FUND','EXM','TIC','LDT','BTC2S','ARDR','BOC','LOL','AOA','RKN','IVY','PAI','MAC','BHT','NB','IHT','OMA','CANA','AED','KST','CELR','LONG','KNC3S','DEP','IDR','$PAC','CAG','DIA','CRU','LOA','HT','EURS','ANT8','GTSE','CTCN','SOL3S','BART','TRADE8','BTC2L','TON','BZRX','EOSDT','COS','MDA','AION','STPT','DUO','SEAL','MCCX','AIDOC','HLX','CNY','OTO','MYR','AAC','PTB','SST','NGN','DUSK','AUC','INR','AIN','ARPA','BZNT','HUSD','ETH3S','EL','DOT3BEAR','POE','CTXC','TRX5S','POWR','CREED','LOKI','DOTUP','LBXC','DPT','MTL','CRV3L','QKC','DEEX','IDEX8','PNK8','KLP','BKRW','AIT','ATOM3BEAR','CHR','ACAT','F','BICAS','CRE','BGBP','ASAFE','FO','MIS','ADA3S','TRB3S','BNB3L','ELY','ETZ','BZ','EDU','TEND','CEL','DODO','STON','IDRT','AVA','INB','BZRX8','HKD','AMF','BEAM','ARE','BKC','SPY','SENSO','BTS','DC','BWB','INFT','FTM3L','DFS','4ETH','BARE','DCN','FNT','ARS','UBU','HSC','PAY','KRT','BTC1S','PCI','18C','DAOBET','TRBO','BRZE','UBTC','REVV','CWV','GTO','RUNE3L','NTR','DNT','UCNS','FX','BWF','OCB','HKX','GOLDR','BDCC','KYSC','BTCV','MCC','CZK','GKC','CBC','BTCSHORT','AQT','BTS8','ONT3L','DEGO','OMG3S','ADM','DMT','UAH','DKK','PDF','MAN','DF','HNC','EDG','PROB','PLN','ABT','AUDT','EBK','BRG','KAVA3L','NEXO','EOSDOWN','ALGO3L','DIP','KTON','CS','ABDX','BEPRO','BSV5L','CENNZ','VBIT','QC','BCZERO','UOS','CTC','OAX','DOCK8','TERC','CPC','JWOC','AERGO','NEO3S','OGX','TCT','AYA','FIA','ETNXP','OCE','BIKI','ALV','FREE','ASKO','LUCKY','ELC','ARN','PHP','DRGN','CIU','OGO','GALA','BAL3S','SYLO','SGT','TFT','BLCT','DKA','ACT','DSS','DION','EOS5S','ETN','BIFI','CHC','SENC','EGT','PNK','BTC3BULL','ALGO3S','AE','SRM3S','GIO','TRTL','AT','XDC','THB','PHA','CRON','DKKT','GLF','ROAD','ADS','FAME','BLZ3L','NEU','LKN','BIXCPRO','ETHDOWN','CTT','MOON','AK','BOLI','POLS','AUX','AFIN','GHT','DPY','3BBULL','STRONG','ATOM3L','BORA','ORMEUS','ABYSS','DTA','BSV3S','EVR','UNI8','SGD','ARNX','LBKL','LBTC','AR','DNA','GAME','DEPOF','ASAC','BCD','OMG3BEAR','UBEX','HY','GHST','SSX','IMG','COFI','GRAM','SOGA','CSPC','MKR3S','ECELL','BAT3L','NZD','BGC','BSV3L','TEL','QTUM5L','NEST','DCA','YET','FEB','NVT','BANCA','TRY','FNX','AIRX','TRIAS','OKB3L','FOODY','BDP','ELA','MIKS','BRD','SBT','CSC','JUR','MERCI','CAP','DREP','AST','KALA','GRIN','MARO','BTCUP','MOB','FFF','MEME','DETS','MIX','BIND','LTG','ADC','AVAX','BLZ3BULL','BRZ','HYC','PCX','APC','QASH','FCT','CXO','BNBDOWN','RUNE3S','IDK','LUCY','SUSHI8','RRB','OCEAN8','NCASH','LTNX','BDT','DOGE3L','BTM','BCH5S','MXC','CVCOIN','AMTT','KDG','FCT2','HSS','LTO','QLC','CODEO','OSST','BTCBULL','AMO','LRC8','COMET','BEER','ELAMA','DMC','EOSC','TRB8','RES','TRX3BULL','CSE','520','TKS','BST','PTF','FIL','CET','AVAX3S','LIN','DX','INX','BAX','DONUT','BCP','BSVS','BWXX','AGVC','NCT','PLAT','SHENG','MSV','SIX','CNTM','MITX','TL','NAS','ONT3BEAR','QCX','EM','CHART','COMC','ES','GT','LIMEX','ENQ','BFC2','SNX3S','GXC','DUCATO','MCH','ONT3S','PPT','MCB','BTCBEAR','PRE','SLP','CVT','COTI','CNB','AG8','BXC','DT','BCDN','DRG','LINA','MDM','FLM3L','RDN','GO','BOA','BIX','BTC3L','NRG','BHP','CKB','DBY','HIVE1','CRV3S','AOG','SKM','PS','GOF8','HT3L','BC','FTM3S','ADAUP','BOLT','TT','ACOIN','CREAM3S','STEEM','NWC','DEXT','FIT','ULMC','MBL','UNO','FFT','FTM',
'ATT','CHAT','JRT','BAL3L','ITC','AFRO','TERN','SGR','GE','LUD','FIL3L','BCPT','AUSD','UNI3L','THETA3L','RNT','STORJ8','MFT','BNB3BEAR','BLOOD','HZT','BNP','SXP3L','AGI','BGN','NVT1','UIP','FSCC','HOPL','EJF','IPX','C20','CVP','ANTTOKEN','USDF','CHS','KAI','NKC','BUY','FOG','REM','SPORTS','ADB','BCH5L','PVT','LINKUP','IOTA3S','KDAG','CPAY','FRONT','ADADOWN','ASY','CNYX','ARIES','LAND','MEO','BBP','TKC','CBRL','FYZ','BPT','ABC','TRX3BEAR','BF','STORJ3BULL','ADX','ODE','USDN','CLP','ETH5L','SHA','LEND3L','PAMP','BCHHG','MKR8','SNX8','3BBEAR','HEDG','WPR','DATX','PEAK','QNT','ABL','FORESTPLUS','COIN','DIVI','PHTF','KNC3L','DAM','AXE','BKBT','PTT','R2R','EGG','TGCC','FF1','BCX','DICE','REL','RCN','TPAY','HP','NOTE','CIX100','4BTC','IOTE','TCH','BAN','UQC','RVC','CPTLC','FAIR','DAC','ASK','NPXS','DGTX','FNB','DTOP','ONES','IDEX','APPC','NKN','UGAS','BNBUP','LTK','NULS','HIPPO','UNC','ETH3BULL','SUKU','PIE','TAI','MPH','BNT8','QHC','GTC','RING8','TYT','RCP','COMPS','BTCXXS','GTS','EHT','SXP3BULL','BRC','BOTH','FLDT','CV','CICC','BURGER','SEOT','DZAR','CRT','HCC','OGN','TELOS','TRUE','BTU','2KEY','BPTC','AMIX','UNIDOWN','BTR','LINK3BULL','BLT','BASID','FOB','NIJI','ONT3BULL','FSN','TMTG','GON','TRN','DAD','LX','INF','SNX3L','RFR','KOCJ','USDPM','ETG','BCH3S','LIBFX','EVX','GXS','SOC','ETC3S','FST','BFT','INNBC','BEN','TOP','DREAM','IMET','HNST','MCO','SWAP','DDD','TRIO','UNI3S','KIP','PLT','ARK','ECOIN','CPTL','ICX3S','TRCB','KNT','EC','KNC8','SUN','BRAZ','SUSHI3L','LBK','CRP','CAS','FAB','UNIUP','BCHC','BXA','ODIN','ETHHG','SBTC','CRPT','CREX','ARCC','COV','KEYT','AIPE','MX','CNH','IOST','ALP','BFC','BLZ','ENDOR','FBT','DENT','SEA','NEWS','BCV','DDMX','EWT','DVP','GPS','CTN','CPI','EBASE','CRV3BEAR','NAX','UNI2S','GBH','HBC','BMW','BCP24','BPL','SATT','DHT','BITG','FIS','ORBS','GSC','ETHUP','COMP3S','BTF','AGU','TFUEL','ASAFE2','ETC3BEAR','CVA','DASH3L','LUNES','PERX','LIEN','STONK','GDFC','BAKE','TTM','KLV','BGL','BCN','DATP','SPH','ETC3L','BURN','ECO','FIL3','COVA','ALY','RC','CENT','CRD','MT','DEFI3L','EKT','THOR','PI','DIFI','MOAC','BAND3S','GTH','BUIDL','OPT','CPS','TGIC','MINI','BLY','ECOC','FN','OST','CND','MAID','GLO','OMG3BULL','ACM','FLM3S','DTR','4ART','HIT','QQQ','STAMP','HAI','META','BNK','COL','FIL6','PPC','CON','DSC','DAWN','UCA','SNTVT','AXPR','MGP','NEVA','LINK3S','DBM','DBC','TOKO','BNTDE','ALPT','DFP','ARC','BIP','IRIS','MTRG','CNTX','TRB3L','BEL','CTSI','IQ','LGC','RIO','NBX','IQN','LRN','DILI','ETHBN','BMH','SUN8','STMX','BIU','LEND8','OMG3L','AITRA','AVAX3BEAR','AIDUS','IBS','SPARTA','LXT','SAFY','BITC','CHSB','SBREE','AVAX8','UBIN','BEST','BNV','LET','AREC','AAT','DMD','CELC','AEON','TOPB','DXD','CSNP','CWV1','HNT3L','ALEPH','STORJ3BEAR','BNB3S','COMP3L','JCC','BAND3BULL','KOK','ECU','APIX','DVC','CRV3BULL','CDB','TRV','LYNX','BAXS','PFID','SNET','EXE','SUB','LOOM','BNANA','BITR','KEN','DZI','CLG','QUN','SWAP1','CEEK','PND','TRIX','ETH3L','DGD','NEAL','NEO3L','MLK','AIM','GHS','CHE','DAT','AENS','IGNIS','GARD','CNS','ORC','EMOB','RVX','LUNA','BOT','NFT','MODL','KAT','4BCH','APM','GRS','BRDG','EURPM','OCN','HNT3S','KAVA3S','MTN','ME','UENC','THA','CORN','BTCDOWN','AREPA','AWC','BTCHG','RSR','PEARL','MAP','BZRX3S','BU','ERK','BNS','GMAC','FIL36','SWINGBY','CSP','ARTE','POW','TRX3S','EA','DOCK','LRG','MITH','JBX','FLM','CREDIT','GST','HISWAP','CAPP','BCH3L','CHI','VD','LMCH','IBH','IQC','GNB','AMLT','IOT','PICK','GBYTE','BAND3BEAR','TITAN','QTUM3S','ETHP','JOB','TEP','IOWN','BBC','LTCDOWN','LYM','NBS8','MOCO','ENG','SAND','DOT2L','EOS3BULL','TRX3L','NBOT','TOPC','IOEX','DOTDOWN','BST1','KCS','EGCC','EDN','PYRK','GOLDL','BRO','GNG','KGC','BOX','ARSL','DOS','IOTA3L','BIR',
'DDAM','FIL3S','FIL6Z','TSR','BRLL','SWTH','BAND8','BXTB','SUTER','ARRR','BCT','PRQ','TRCL','KZT','RING','EOS3BEAR','PURE','MOBI','PT','BASIC','ELEC','LTCS','CGT','OM','DOT3BULL','ORN','PERL','TRXUP','AMM','LYXE','KSM8','FLX','CNNS','AVAX3BULL','AXEL','RLC3S','SDT','RFUEL','JUS','PROM','APL','KAN','CHX','R','BR','RUFF','ANKR8','WAN','MASS','KNGC','BTCXXL','ABBC','FARM','CONI','CDT','HNS','UNISWAP','AB','EOSDAC','SAT','SFG','FTI','BTCS','CMD','CVP8','RARI','BIK','EOS3S','HDAC','ELYX','BGPT','BEE','DRK','EMU','BLOCK','UNII','KDA','JNB','ICX3L','COLA','RTH','HYN','LINK3L','KIN','NNB','BLOC','ENJ3L','HAPY','GBK','BRCE','SERO','CNV','BAND3L','REV','INNBCL','EOSUP','BOS','AET','AMB','DOT2S','ACE','LTC3L','SNC','AUDAX','CCXX','AMDC','OIN','SOL3L','4LTC','SALT','MTV','CLM','ARION','PLF','QRC','BTY','PLR','0XBTC','BTC3S','ADA3L','ALITA','BHAO','MELE','BLZ3S','PBC','STX','ENJ3S','LEMO','MTRAX','POST','OKB3S','SMT','KIMCHI','PAZZI','NXM','MIR','DAPPT','BLC','TUSDT','EXO','BLZ3BEAR','COCOS','QPSN','TRXDOWN','EFAR','AEM','GHOST','IOST3S','ISLA','COAL','ATTN','SUSD','NIM','AMIO','POLY','ULU','ARQ','AUSC','MDU','BKS','REBASE','FES','BRI','MQL','GIX','UMA8','PERP','TNC','TROY','BTC3BEAR','STORJ3S','PEARL8','UCT','HKMT','NODE','TIT','BEATS','THETA','PHB','SEELE','GSE','UNI2L','AUOP','ADMN','ATOM3S','LBA','MW','DK','KCASH','BSTY','FLASH','KFC','GC','ETH1S','BZRX3L','GEEQ','404','OE','DOT3L','OLT','TCFX','MTR','AMR','ETHV','SHR','TWT','ETC3BULL','AZR','FLETA','RWN','ORST','MED','JFIN','BCK','BIZZ','EOS5L','HT3S','NEW','UHP','AIS','MDT','HDAO','BTB','CXC','EKO','SGA','BITSD','ETH3BEAR','GDP','EOSHG','USDA','BTC5L','MXN','RLC3L','OKS','AUTO','EOS3L','CNT','DEC','BRAVO','QTUM3L','ACPT','LTCUP','SAFE','PGS','LINK3BEAR','SXP3S','SHROOM','CVNT','AHT','CRV8','CHP','GNX','HL','BKK','NTB','IZE','IPFST','GSL','POL','RCOIN','LID','EXMR','BOOM','NBS','IOST3BULL','BSV5S','AGS','DASH3S','HB10','RIF','JNT','CYFM','ART','BECN','DCASH','BZH','SXP3BEAR','MATH','CRW','NDN','FCG','BCHS','GTA','DERO','STOR','ECOREAL','LAR','GEO','USCO','MEG','GOF','4EOS','MOF','ETH5S','SUSHI3S','BAT3S','MXW','IPR','FIO','SSP','KOIN','LEND3S','BBT','PMA','UFC','JT','MOM','MKR3L','BID','FTN','EIDOS','CNG','GBT','AAB','NXT','EFK','ATOM3BULL','AEG','PTI','EMC2','SINOC','SNK','RED','JS','EVA','LTC3S','SHE','FOR','SPA','ARX','ROZ','RATING','DAX','JEX','GOLD','LVX','IOST3BEAR','AKC','BMT','BNB3BULL','HPOT','GICT','HMCN','FME','GRN','ANS','BNCT','MXT','BTCHEDGE','REN8','ETHS','PXG','DEXA','FFF1','PICKLE','OKG','STORJ3L','SLM','SUP','UP','UNI3BEAR','BNOX','NOIA','STOP','USDJ','ANW','BNODE','BCNT','AVF','CHADS','IOTX','QQBC','DTO','JFI','AXIS','TEC','MTP','JAR','NUT','SRM3L','MANA8','HGC','KLAY','BSYS','MET','MDS','HTDF','SWFTC','HUNT','TRADE','LAMB','PST','USDG','BIUT','CAMP','KEEP','GPO','XBC','SWRV','DEFI3S','HMR','BTC5S','MTX','AOS','QBTS','ANK','KOMP','TST1','QTUM5S','UNI3BULL','RSV','DOGE3S','DMCH','CNN','MYX','BNA','SPKZ','MPT','ATOMX','THETA3S','TCJ','DIA8','FSHN','LEVELG','IOST3L','PHX','PNT','IZI','HAKKA','LBC','CMN','GA','OK','BCZ','DXT','ULAM','AVAX3L','EGC','NET','ETHPLO','VELO','MB8','EUNO','XDB','GIV','URO','YAMV2','VEX','CURE','MTC','ZEL','TER','MOC','PIRL','MUE','ETLT','SAPP','TKN','PC','WIN','DYN','SCC','XLMG','WEC','PIPL','QBZ','NVC','VERI','ZER','YFARMER','ZLW','WRC','XUC','MCR','TENA','MARS','ZRX3S','XAS','WDT','DOV','ICH','PTOY','TCP','YI12','OWC','KRL','S4F','ROOBEE','ZIL3L','YFII3BEAR','REX','PORTAL','MUSK','TTC','GET','OPQ','DYNMT','VIDT','CAKE','SLS','MO','NOIZ','XQR','SNL','WB','ZB','ZRC','EEX','YOO','UBQ','MBPRK02','CHTC','YFV','CHFL','DTEP','EMRX','IIC','XSR','SPND','MAZ','P2P','YLD','RTE','KICK','DAPS','TOS','VIBE','WBX',
'SCOL','TUDA','XWC2','DEX','XTZ3L','NNN','NAV','VDL','VKNF','HMB','GOC','TRUMP','VET3BULL','UPP','POCC','XMX','KWH','YFI3BEAR','YFI8','SPAZ','LIPS','WET','ERS','VTC','TIME','MRV','QQC','GAP','TUT','PENG','GXT','XRP5S','SCRT','RNDR','VEN','VTHO','IDT','HEM','NLC2','MALW','VIB','IUT','KTV','VID','FLIXX','FACE','ION','LOC','JOYS','WNXM8','TDPS','SYS','KNL','XMR3S','SCL','CRAD','CICX','XPR','NCDT','YUSRA','XRP5L','VAULT','VET3BEAR','ODC','HUSL','YTA','MCI','NEXXO','HRK','UTK','GPL2','YFL','VSX','MLM','XANK','VBK','YOU','GUAP','SNB','NGC','PXL','NIX','FTX','WINB','RADS','VSYS','ERT','MPAY','YTSLA','ZRX3L','VIDY','YEE','KTETH','XFIL','TYC','XTP','VANY','XIN','XRB','VRO','USDL','PEN','METAL','FOIN','PITCH','ILK','RKT','PROPY','SHIP','ROCO','NMP','NKD','NSR','TUBE','CUR','XCON','EDC20','CPT','ZAIF','SLR','ETHOS','KICKS','NT','SWIPP','CRYPT','TERA','MBCONS02','HXX','NPLC','PLAY','EDCC','MXM','MYTV','GCZ','YO','VGW','WING','TRM','ZANO','UTED','TRU','HEX','MIN','ZJLT','BTC2','SPC','ZAR','MRPH','EMD','KIND','XTZDOWN','BURST','HET','PPD','NYE','ZON','TDX','LAAR','ERG','FLOT','CBIX','XRT','BVK','DMME','XRPUP','WTA','LTT','XWP','RST','GOM2','UTI','XVX','FKX','ILS','FLS','GSMT','WAFL','VLX','SXC','WOM','VRA','THS','VIA','TORM','HOMI','RISE','YFII3S','ZPR','UC','MVL','PNY','VET3L','VINCI','ZDC','VDS','MYB','ZEC3BEAR','MFA','YFV8','WBTC','TRXB','KYF','XRP3BULL','WAVES3L','GDC','YAP','ZTC','MEX','SRN','XRPDOWN','SWT','ZT','XAMP','BZX','THR','ZAP','TEN','SNGJ','MONA','CSPN','YOUC','TRIGX','PBLC','XNC','XNK','SINS','RSIN','LKR','WINGS','DACC','CLB','ZYN','EVY','IRD','NEX','WHALE','XLM3S','LYRA','CCY','PING','GM','GEX','UUU','BTE','FIRSTBLOOD','GVT','WETT','SCAP','CVCC','VDX','ESK','RDCT','YAS','XLM3L','LYFE','LVTC','SEK','MYST','NST','YAM','VEST','OBSR','NEBL','FLO','HUF','YFI3BULL','XGCS','KRB','MSR','HKY','MFC','UAT','LNKC','XAUR','WJC','SOUL','PYG','VDG','XWC','MTT','SAIT','LA','WICC','LPT','INCNT','XSN','YOD','GLC','PKT','BRZX','CDZC','TAAS','XSTAR','EXCC','XEQ','WOMG','TAU','RNO','WGR','PCC','CCX','NXS','XRC','VNT','SNGLS','WNL','ZEC3BULL','ECOS','SIG','BTTB','SRK','TTX','TNET','WXT','RFOX','HALV','FOUR','PRES','GMC','SNTR','RINGX','XRP3L','XCP','TYM','DOLLAR','MODX','SKY','TLO','HVN','WEST','CLR','CUT','XRP3BEAR','SRTY','ONL','GCX','BTCB','UNUS','ZAG','GRANC','QRL','WPX','CATS','MODIC','LIQ','CGC','QSP','DINT','ZNY','DEFI','XTZ3S','W12','VND','PAS','IOC','MEET','HTML','MWAT','TSHP','PBTC','XMR3L','NIS','DMDC','PIRATE','I9C','TBT','XLA','DOGEBF','KTS','EZPAY','LUK','PLTC','NTK','ZNZ','IDRTB','REDN','LUN','TFB','WELL','UPT','HEX2T','UZT','VALOR','KUE','RCCC','ERTH','TRAC','VRC','LCC','DLT','PBT','PRA','GMB','GRNT','EMTV','UBT','STEEMD','NYC','EMRALS','IDH','WDS','FTC','TBCC','QBIT','XRPHG','XNV','ZOC','HGT','VIEW','SSC','DMS','UKEY','TOL','ZEC3S','FDR','VITE','GVE','MODEX','SPX','STAR','YCC','OOT','TOUR','BYTZ','GXX','SHIFT','JUMP','ISK','EPS','SUMO','HMQ','ZCNOX','TDP','PEPS','ZEON','OLBC','XCCZ','ETHO','BTCT','VRSC','SXUT','XTZUP','KLKS','ECA','XMV','STK','XDN','NBTC','WIRE','XOR','JDC','SPOT','MTH','ZYRO','SSO','KC','ZSC','ZASH','ZCR','EVED','SWL','YAMV3','LEVL','YDAO','XPM','TOK','GAU','RON','MBPRK01','SYBC','TUSC','CLOAK','GBX','IPL','USDQ','XFC','HUSH','LUX','ETH2S','NSD','ETF','XST','XFIN','IMGC','XLM3BEAR','NOW','ONIT','ZYX','XRPS','XNS','VII','CRYPTO','CLBK','DCT','EVN','YFII3L','YFI3L','RMPL','MINT','ZEBI','ERD','EFX','XLT','RENBTC','NPC','MOG','VGX','ZEC3L','TCC','EFL','CAM','TX','BTOUR','XTA','ESBC','VAIP','NOKU','NMC','EHRT','BTCP','TCZ','KGSL','VRM','KUBO','PAN','JST3L','ESH','GUP','FUNC','SPHR','DCNTR','VOLUME','DDR','SIN','BZO','IG','EDC','XKLP','NAH','ZLA','XAU','XPX','FCH','XXA','JST3S',
'BYRON','XLM3BULL','TFL','ONION','TRST','XSC','PART','LNO','RUPL','LSV','YFP','MOIN','GSR','NCC','MYU','EGEM','MZG','EXT','ZNN','SWYFTT','LCX','DBIX','WOW','BUL','WETH','ETH2L','PWRB','ZIL3S','XQC','EXP','STO','PPY','FDZ','XLP','PXP','UT','IDX','ETHBNT','MRX','FXC','NFXC','MVP','LOG','XT','ULG','MBPRK03','PEOS','USDTERC20','MICRO','SXDT','PKGO','USC','PAYTOMAT','MEC','ROX','ITCM','WNT','RYO','HBT','MON','SFX','KAM','PLURA','OTON','LUNAX','WGRT','YFI3S','YSR','HLM','MLGC','NSDC','LATX','YTN','ECHO','YFII3BULL','PHL','EQL','NLG','GIC','CHND','VRS','XFOC','XMC','NTY','GRC','TAZ','WBIND','FYP','MCPC','PCM','XPO','GIG','GGC','SIB','SAN','MYO','TTT','QPY','EPG','XHV','YFII8','MIDAS','HBD','MMD','ZXC','FOAM','FK','CBX','HOTC','SNM','YF','ITAM','INSTAR','TOR','EXCL','DRM','XRP3S','LABX','PLU','IFX24','MBPRK04','RAE','LBURST','WAVES3S','ONOT','TZC','MWC','TRTT','SHND','JUL','VRBX','IFC','DVT','BWT','XB','POT','VEIL','XPRM','FLP','VET3S','XBP','BTX','PINK','HWI','HQX','EXY','DOOS','XYO','VDA']
        }
    ]

    # a buffer to not make many queries on sources
    instance_source_apis_consults = {}

    def get_request(self,source_uri, headers):
        try:
            res = requests.get(source_uri,headers=headers)
            return {'html': res.text, 'status': res.status_code, 'url': res.url, 'original_url': source_uri}
        except requests.RequestException:
            return

    def get_rates(self,currencies):
        rates = {}
        currencies.append(self.base_currency)
        for currency in currencies:
            rates[currency] = self._get_rates_from_local(currency)
        return rates

    def add_rates(self,currencies):
        rates = {}
        for currency in currencies:
            rate = self._get_rates_from_local(currency)
            if(rate is None):
                remote_rate = self._get_rates_from_remote(currency)
                rates[currency] = self._upsert_currency_rate(remote_rate)
            else:
                rates[currency] = rate
        return rates

    def delete_rates(self,currencies):
        resultd = Rate().delete_many({"currency": {'$in': currencies}})
        return resultd.deleted_count

    def _get_rates_from_local(self,currency):
        output = None
        documents = Rate().find(query={"currency": {'$eq': currency}})

        if len(documents):
            output = documents[0]
        return output

    def _get_rates_from_remote(self,currency):
        remote_rate = None
        candidate_engines = []
        for i in self.source_apis:
            if currency in i['currencies']:
                candidate_engines.append({'engine':i['engine'], 'request':i['request']})

        #when we have more than on candidate implement a choice rule
        if len(candidate_engines):
            rates_list = self._engine_factory(candidate_engines[0]['engine'], candidate_engines[0]['request'])

            if currency in rates_list:
                remote_rate = rates_list[currency]

        return remote_rate

    def _engine_factory(self, engine, request):
        if engine == 'exchangerate':
            return self._engine_exchangerate(engine, request)
        elif engine == 'coinapi':
            return self._engine_coinapi(engine, request)
        else:
            raise Exception('Sour not found for factory')

    def _engine_exchangerate(self, engine, request_model):
        output = {}
        if engine not in self.instance_source_apis_consults:
            response = self.get_request(request_model['endpoint'],request_model['headers'])
            object = json.loads(response['html'])
            if object['rates']:
                self.instance_source_apis_consults[engine] = {}
                for i in object['rates']:
                    self.instance_source_apis_consults[engine][i] = {
                        'engine': engine,
                        'currency': i,
                        'rate': object['rates'][i],
                        'time': object['time_last_updated']
                    }
                output = self.instance_source_apis_consults[engine]
            #print('>>>>>>>>> GOT FROM SOURCE')
        else:
            output = self.instance_source_apis_consults[engine]
            #print('>>>>>>>>> GOT FROM BUFFER')
        return output

    def _engine_coinapi(self,engine, request_model):
        output = {}
        if engine not in self.instance_source_apis_consults:
            response = self.get_request(request_model['endpoint'],request_model['headers'])
            object = json.loads(response['html'])
            if object['rates']:
                self.instance_source_apis_consults[engine] = {}
                for i in object['rates']:
                    self.instance_source_apis_consults[engine][i['asset_id_quote']] = {
                        'engine': engine,
                        'currency': i['asset_id_quote'],
                        'rate': i['rate'],
                        'time': i['time']
                    }
                output = self.instance_source_apis_consults[engine]
            #print('>>>>>>>>> GOT FROM SOURCE')
        else:
            output = self.instance_source_apis_consults[engine]
            #print('>>>>>>>>> GOT FROM BUFFER')
        return output

    def _upsert_currency_rate(self,remote_rate):
        rate_instance = Rate()

        # documents = rate_instance.find(query={"currency": {'$eq': remote_rate['currency']}})
        documents = rate_instance.find(query={"currency": remote_rate['currency']})
        if len(documents) > 0:
            result = rate_instance.update(remote_rate,remote_rate['_id'])
        else:
            result = rate_instance.create(remote_rate)

        return result











































