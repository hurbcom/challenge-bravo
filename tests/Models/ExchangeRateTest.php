<?php

use PHPUnit\Framework\TestCase;

use App\Models\ExchangeRate;
use App\Models\Currency;

//TODO fazer o teste  para quando o currency não existir no from e no to(quando usar BANCO)
class ExchangeRateTest extends TestCase
{
    //{"aed":0.727625,"afn":15.738258,"all":20.477564,"amd":98.220992,"ang":0.355597,"aoa":127.787128,"ars":18.969143,"aud":0.265312,"awg":0.356562,"azn":0.336753,"bam":0.326512,"bbd":0.399986,"bch":0.000394,"bdt":16.78998,"bgn":0.327056,"bhd":0.074673,"bif":393.605018,"bmd":0.19809,"bnd":0.266735,"bob":1.368868,"brl":1,"bsd":0.198107,"btc":6.0e-6,"btn":14.769548,"bwp":2.16268,"byn":0.501335,"bzd":0.399319,"cad":0.246381,"cdf":396.180189,"chf":0.183439,"clf":0.004937,"clp":146.685715,"cnh":1.282598,"cny":1.281465,"cop":748.384377,"crc":122.81051,"cup":4.754396,"cve":18.509538,"czk":4.273398,"djf":35.204572,"dkk":1.243621,"dop":11.316887,"dzd":26.61905,"ecs":0.167228,"eek":0.167228,"egp":3.109474,"ern":0.167228,"etb":8.656537,"eth":9.3e-5,"eur":0.167243,"fjd":0.411324,"gbp":0.143933,"gel":0.626955,"ghs":1.166751,"gip":0.143912,"gmd":10.130327,"gnf":1952.177882,"gqe":109.504957,"gtq":1.535273,"gyd":41.429315,"hkd":1.538368,"hnl":4.754162,"hrk":1.252444,"htg":18.126095,"huf":58.717866,"idr":2906.675002,"ils":0.647539,"inr":14.768112,"iqd":289.310583,"irr":8340.583431,"isk":24.590904,"jmd":29.985452,"jod":0.140446,"jpy":22.102893,"kes":21.373921,"kgs":16.794078,"khr":808.801856,"kmf":82.331196,"kpw":0.764133,"krw":224.781744,"kwd":0.059675,"kyd":0.165086,"kzt":84.607429,"lak":1880.865448,"lbp":303.672115,"lkr":39.520975,"lrd":33.972451,"lsl":2.865373,"ltc":0.001429,"lyd":0.894377,"mad":1.770034,"mdl":3.578646,"mga":776.513171,"mkd":10.299936,"mmk":326.072737,"mnt":557.623616,"mop":1.584287,"mru":7.164919,"mur":8.447336,"mvr":3.050587,"mwk":159.462526,"mxn":3.963014,"myr":0.823857,"mzm":12.578721,"mzn":12.449962,"nad":2.865373,"ngn":81.415029,"nio":6.962867,"nok":1.709428,"npr":23.631257,"nzd":0.284387,"omr":0.076258,"pab":0.198107,"pen":0.76651,"pgk":0.696287,"php":9.817345,"pkr":31.337853,"pln":0.754882,"pyg":1336.38194,"qar":0.721246,"ron":0.823995,"rsd":19.632723,"rub":14.558017,"rwf":195.316833,"sar":0.742934,"sbd":1.590453,"scr":2.958832,"sdg":89.734813,"sek":1.700306,"sgd":0.267295,"shp":0.14314,"sll":2031.41392,"sos":115.882705,"srd":4.133249,"ssp":0.14314,"std":89.360066,"stn":4558.053075,"svc":1.733497,"syp":497.206137,"szl":2.865373,"thb":6.357107,"tjs":2.259321,"tmt":0.694306,"tnd":0.550294,"top":0.446208,"try":1.718457,"ttd":1.345998,"twd":5.524733,"tzs":459.393313,"uah":5.425492,"ugx":705.635544,"usd":0.19809,"uyu":2.345203,"uzs":570.563352,"vef":637171.051589,"ves":641456.353819,"vnd":1241.029218,"vuv":21.627477,"wst":0.167228,"xaf":108.59299,"xag":0.167228,"xcd":0.535348,"xof":29.822451,"xpd":19.929844,"xpf":20.017004,"xpt":0.167228,"yer":13.495603,"zar":2.864317,"zmw":1.221812}

    public function testGetExchangeWithFromAndToInApiReturn()
    {
        $exRate = rand(1, 10);
        $amount = rand(1, 20);

        $mock = $this->getMockBuilder(ExchangeRate::class)
            ->disableOriginalConstructor()
            ->setMethods(['getRates'])
            ->getMock();
        $mock->expects($this->once())
            ->method('getRates')
            ->will($this->returnValue(json_decode('{"eur" : '.$exRate.'}')));
        $exchange = $mock
            ->from(new Currency(['name' => 'USD']))
            ->to(new Currency(['name' => 'EUR']))
            ->amount($amount)
            ->get();
        $this->assertEquals([
            'status' => true,
            'data' => [
                'from' => 'USD',
                'to' => 'EUR',
                'exchangeRate' => sprintf('%.6f', $exRate),
                'amount' => sprintf('%.6f', $amount),
                'exchange' => sprintf('%.6f', $exRate*$amount),
            ]
        ], $exchange);
    }

}