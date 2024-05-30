<?php

declare(strict_types=1);

return [
    'accepted'             => ':attribute naa gbọdọ gba.',
    'accepted_if'          => ':attribute naa gbọdọ gba nigbati :other jẹ :value.',
    'active_url'           => ':attribute naa kii ṣe URL to wulo.',
    'after'                => 'Awọn :attribute gbọdọ jẹ ọjọ kan lẹhin :date.',
    'after_or_equal'       => ':attribute naa gbọdọ jẹ ọjọ lẹhin tabi dọgba si :date.',
    'alpha'                => 'Awọn :attribute gbọdọ ni awọn lẹta nikan ninu.',
    'alpha_dash'           => ':attribute naa gbọdọ ni awọn lẹta nikan ninu, awọn nọmba, awọn dashes ati awọn ami abẹlẹ.',
    'alpha_num'            => ':attribute naa gbọdọ ni awọn lẹta ati awọn nọmba nikan ninu.',
    'array'                => 'Awọn :attribute gbọdọ jẹ ohun orun.',
    'ascii'                => 'Aaye :attribute gbọdọ ni awọn ohun kikọ alphanumeric-baiti kan ṣoṣo ati awọn aami.',
    'before'               => ':attribute naa gbọdọ jẹ ọjọ kan ṣaaju :date.',
    'before_or_equal'      => ':attribute naa gbọdọ jẹ ọjọ ṣaaju tabi dọgba si :date.',
    'between'              => [
        'array'   => 'Awọn :attribute gbọdọ ni laarin :min ati :max awọn ohun kan.',
        'file'    => ':attribute naa gbọdọ wa laarin :min ati :max kilobytes.',
        'numeric' => ':attribute naa gbọdọ wa laarin :min ati :max.',
        'string'  => ':attribute naa gbọdọ wa laarin awọn ohun kikọ :min si :max.',
    ],
    'boolean'              => 'Aaye :attribute gbọdọ jẹ otitọ tabi eke.',
    'can'                  => 'Aaye :attribute naa ni iye laigba aṣẹ.',
    'confirmed'            => 'Awọn ìmúdájú :attribute ko baramu.',
    'current_password'     => 'Ọrọigbaniwọle ko tọ.',
    'date'                 => ':attribute naa kii ṣe ọjọ to wulo.',
    'date_equals'          => ':attribute naa gbọdọ jẹ ọjọ ti o dọgba si :date.',
    'date_format'          => ':attribute naa ko baramu ọna kika :format.',
    'decimal'              => 'Aaye :attribute gbọdọ ni awọn aaye eleemewa :decimal.',
    'declined'             => ':attribute naa gbọdọ kọ silẹ.',
    'declined_if'          => ':attribute naa gbọdọ kọ silẹ nigbati :other jẹ :value.',
    'different'            => ':attribute ati :other gbọdọ yatọ.',
    'digits'               => ':attribute naa gbọdọ jẹ awọn nọmba :digits.',
    'digits_between'       => 'Awọn :attribute gbọdọ wa laarin :min ati :max awọn nọmba.',
    'dimensions'           => ':attribute naa ni awọn iwọn aworan ti ko tọ.',
    'distinct'             => 'Aaye :attribute naa ni iye ẹda-ẹda kan.',
    'doesnt_end_with'      => 'Aaye :attribute ko gbọdọ pari pẹlu ọkan ninu awọn atẹle: :values.',
    'doesnt_start_with'    => 'Aaye :attribute ko gbọdọ bẹrẹ pẹlu ọkan ninu awọn atẹle: :values.',
    'email'                => ':attribute naa gbọdọ jẹ adirẹsi imeeli to wulo.',
    'ends_with'            => ':attribute naa gbọdọ pari pẹlu ọkan ninu awọn atẹle: :values.',
    'enum'                 => ':attribute ti o yan ko wulo.',
    'exists'               => ':attribute ti o yan ko wulo.',
    'extensions'           => 'Aaye :attribute gbọdọ ni ọkan ninu awọn amugbooro wọnyi: :values.',
    'file'                 => 'Awọn :attribute gbọdọ jẹ faili kan.',
    'filled'               => 'Aaye :attribute gbọdọ ni iye kan.',
    'gt'                   => [
        'array'   => 'Awọn :attribute naa gbọdọ ni diẹ sii ju awọn nkan :value lọ.',
        'file'    => 'Awọn :attribute gbọdọ jẹ tobi ju :value kilobytes.',
        'numeric' => 'Awọn :attribute gbọdọ jẹ diẹ sii ju :value lọ.',
        'string'  => ':attribute naa gbọdọ jẹ ti o tobi ju awọn ohun kikọ :value lọ.',
    ],
    'gte'                  => [
        'array'   => 'Awọn :attribute gbọdọ ni awọn nkan :value tabi diẹ sii.',
        'file'    => ':attribute naa gbọdọ tobi ju tabi dọgba si :value kilobytes.',
        'numeric' => ':attribute naa gbọdọ tobi ju tabi dọgba si :value.',
        'string'  => ':attribute naa gbọdọ tobi ju tabi dọgba si awọn ohun kikọ :value.',
    ],
    'hex_color'            => 'Aaye :attribute gbọdọ jẹ awọ hexadecimal to wulo.',
    'image'                => 'Awọn :attribute gbọdọ jẹ aworan kan.',
    'in'                   => ':attribute ti o yan ko wulo.',
    'in_array'             => 'Aaye :attribute ko si ni :other.',
    'integer'              => ':attribute naa gbọdọ jẹ odidi kan.',
    'ip'                   => ':attribute naa gbọdọ jẹ adiresi IP to wulo.',
    'ipv4'                 => ':attribute naa gbọdọ jẹ adiresi IPv4 to wulo.',
    'ipv6'                 => ':attribute naa gbọdọ jẹ adiresi IPv6 to wulo.',
    'json'                 => ':attribute naa gbọdọ jẹ okun JSON to wulo.',
    'lowercase'            => 'Aaye :attribute gbọdọ jẹ kekere.',
    'lt'                   => [
        'array'   => 'Awọn :attribute gbọdọ ni kere ju :value awọn ohun kan.',
        'file'    => 'Awọn :attribute gbọdọ jẹ kere ju :value kilobytes.',
        'numeric' => 'Awọn :attribute gbọdọ jẹ kere ju :value.',
        'string'  => 'Awọn :attribute gbọdọ jẹ kere ju awọn ohun kikọ :value.',
    ],
    'lte'                  => [
        'array'   => 'Awọn :attribute naa ko gbọdọ ni diẹ sii ju awọn nkan :value lọ.',
        'file'    => 'Awọn :attribute gbọdọ jẹ kere ju tabi dogba si :value kilobytes.',
        'numeric' => 'Awọn :attribute gbọdọ jẹ kere ju tabi dogba si :value.',
        'string'  => 'Awọn :attribute gbọdọ jẹ kere ju tabi dogba si awọn ohun kikọ :value.',
    ],
    'mac_address'          => ':attribute naa gbọdọ jẹ adiresi MAC ti o wulo.',
    'max'                  => [
        'array'   => 'Awọn :attribute naa ko gbọdọ ni diẹ sii ju awọn nkan :max lọ.',
        'file'    => ':attribute ko yẹ ki o tobi ju :max kilobytes.',
        'numeric' => 'Awọn :attribute ko gbọdọ jẹ ju :max lọ.',
        'string'  => 'Awọn :attribute ko gbọdọ tobi ju awọn ohun kikọ :max lọ.',
    ],
    'max_digits'           => 'Aaye :attribute ko gbọdọ ni diẹ sii ju awọn nọmba :max lọ.',
    'mimes'                => ':attribute naa gbọdọ jẹ iru faili: :values.',
    'mimetypes'            => ':attribute naa gbọdọ jẹ iru faili: :values.',
    'min'                  => [
        'array'   => 'Awọn :attribute gbọdọ ni o kere ju awọn ohun :min.',
        'file'    => ':attribute naa gbọdọ jẹ o kere ju :min kilobytes.',
        'numeric' => 'Awọn :attribute gbọdọ jẹ o kere ju :min.',
        'string'  => 'Awọn :attribute gbọdọ jẹ o kere ju awọn ohun kikọ :min.',
    ],
    'min_digits'           => 'Aaye :attribute gbọdọ ni o kere ju awọn nọmba :min.',
    'missing'              => 'Aaye :attribute gbọdọ sonu.',
    'missing_if'           => 'Aaye :attribute gbọdọ sonu nigbati :other jẹ :value.',
    'missing_unless'       => 'Aaye :attribute naa gbọdọ padanu ayafi ti :other jẹ :value.',
    'missing_with'         => 'Aaye :attribute gbọdọ padanu nigbati :values wa.',
    'missing_with_all'     => 'Aaye :attribute gbọdọ padanu nigbati :values wa.',
    'multiple_of'          => ':attribute naa gbọdọ jẹ ọpọ ti :value.',
    'not_in'               => ':attribute ti o yan ko wulo.',
    'not_regex'            => 'Ọna kika :attribute ko wulo.',
    'numeric'              => 'Awọn :attribute gbọdọ jẹ nọmba kan.',
    'password'             => [
        'letters'       => 'Aaye :attribute gbọdọ ni o kere ju lẹta kan ninu.',
        'mixed'         => 'Aaye :attribute gbọdọ ni o kere ju lẹta nla kan ati lẹta kekere kan.',
        'numbers'       => 'Aaye :attribute gbọdọ ni o kere ju nọmba kan ninu.',
        'symbols'       => 'Aaye :attribute gbọdọ ni o kere ju aami kan ninu.',
        'uncompromised' => ':attribute ti a fun ti han ninu jijo data kan. Jọwọ yan oriṣiriṣi :attribute.',
    ],
    'present'              => 'Aaye :attribute gbọdọ wa.',
    'present_if'           => 'Aaye :attribute gbọdọ wa nigbati :other jẹ :value.',
    'present_unless'       => 'Aaye :attribute gbọdọ wa ayafi ti :other jẹ :value.',
    'present_with'         => 'Aaye :attribute gbọdọ wa nigbati :values ba wa.',
    'present_with_all'     => 'Aaye :attribute gbọdọ wa nigbati :values ba wa.',
    'prohibited'           => 'Aaye :attribute naa ti ni idinamọ.',
    'prohibited_if'        => 'Aaye :attribute naa jẹ eewọ nigbati :other jẹ :value.',
    'prohibited_unless'    => 'Aaye :attribute naa jẹ eewọ ayafi ti :other wa ni :values.',
    'prohibits'            => 'Aaye :attribute naa ṣe idiwọ :other lati wa.',
    'regex'                => 'Ọna kika :attribute ko wulo.',
    'required'             => 'Aaye :attribute naa nilo.',
    'required_array_keys'  => 'Aaye :attribute gbọdọ ni awọn titẹ sii fun: :values.',
    'required_if'          => 'Aaye :attribute naa nilo nigbati :other jẹ :value.',
    'required_if_accepted' => 'Aaye :attribute naa nilo nigbati :other gba.',
    'required_unless'      => 'Aaye :attribute naa nilo ayafi ti :other wa ninu :values.',
    'required_with'        => 'Aaye :attribute naa nilo nigbati :values wa.',
    'required_with_all'    => 'Aaye :attribute naa nilo nigbati :values wa.',
    'required_without'     => 'Aaye :attribute naa nilo nigbati :values ko ba wa.',
    'required_without_all' => 'Aaye :attribute naa nilo nigbati ko si ọkan ninu :values wa.',
    'same'                 => 'Awọn :attribute ati :other gbọdọ baramu.',
    'size'                 => [
        'array'   => 'Awọn :attribute gbọdọ ni awọn nkan :size ninu.',
        'file'    => ':attribute naa gbọdọ jẹ :size kilobytes.',
        'numeric' => ':attribute gbọdọ jẹ :size.',
        'string'  => 'Awọn :attribute gbọdọ jẹ :size kikọ.',
    ],
    'starts_with'          => 'Awọn :attribute gbọdọ bẹrẹ pẹlu ọkan ninu awọn atẹle: :values.',
    'string'               => 'Awọn :attribute gbọdọ jẹ okun.',
    'timezone'             => ':attribute naa gbọdọ jẹ agbegbe aago to wulo.',
    'ulid'                 => 'Aaye :attribute gbọdọ jẹ ULID to wulo.',
    'unique'               => 'Awọn :attribute naa ti gba tẹlẹ.',
    'uploaded'             => 'Awọn :attribute kuna lati gbejade.',
    'uppercase'            => 'Aaye :attribute gbọdọ jẹ oke.',
    'url'                  => ':attribute naa gbọdọ jẹ URL to wulo.',
    'uuid'                 => ':attribute naa gbọdọ jẹ UUID ti o wulo.',
    'attributes'           => [
        'address'                  => 'adirẹsi',
        'affiliate_url'            => 'URL alafaramo',
        'age'                      => 'ọjọ ori',
        'amount'                   => 'iye',
        'announcement'             => 'ìkéde',
        'area'                     => 'agbegbe',
        'audience_prize'           => 'joju jepe',
        'available'                => 'wa',
        'birthday'                 => 'ojo ibi',
        'body'                     => 'ara',
        'city'                     => 'ilu',
        'compilation'              => 'akopo',
        'concept'                  => 'ero',
        'conditions'               => 'awọn ipo',
        'content'                  => 'akoonu',
        'country'                  => 'orilẹ-ede',
        'cover'                    => 'ideri',
        'created_at'               => 'ṣẹda ni',
        'creator'                  => 'Eleda',
        'currency'                 => 'owo',
        'current_password'         => 'lọwọlọwọ ọrọigbaniwọle',
        'customer'                 => 'onibara',
        'date'                     => 'ọjọ',
        'date_of_birth'            => 'ojo ibi',
        'dates'                    => 'awọn ọjọ',
        'day'                      => 'ojo',
        'deleted_at'               => 'paarẹ ni',
        'description'              => 'apejuwe',
        'display_type'             => 'àpapọ iru',
        'district'                 => 'agbegbe',
        'duration'                 => 'iye akoko',
        'email'                    => 'imeeli',
        'excerpt'                  => 'yiyan',
        'filter'                   => 'àlẹmọ',
        'finished_at'              => 'pari ni',
        'first_name'               => 'orukọ akọkọ',
        'gender'                   => 'abo',
        'grand_prize'              => 'nla joju',
        'group'                    => 'ẹgbẹ',
        'hour'                     => 'wakati',
        'image'                    => 'aworan',
        'image_desktop'            => 'tabili aworan',
        'image_main'               => 'akọkọ aworan',
        'image_mobile'             => 'mobile aworan',
        'images'                   => 'awọn aworan',
        'is_audience_winner'       => 'jẹ olugbo olutayo',
        'is_hidden'                => 'ti wa ni pamọ',
        'is_subscribed'            => 'ti wa ni alabapin',
        'is_visible'               => 'jẹ han',
        'is_winner'                => 'jẹ olubori',
        'items'                    => 'awọn nkan',
        'key'                      => 'bọtini',
        'last_name'                => 'Oruko idile',
        'lesson'                   => 'ẹkọ',
        'line_address_1'           => 'adirẹsi ila 1',
        'line_address_2'           => 'adirẹsi ila 2',
        'login'                    => 'wo ile',
        'message'                  => 'ifiranṣẹ',
        'middle_name'              => 'orukọ aarin',
        'minute'                   => 'iseju',
        'mobile'                   => 'alagbeka',
        'month'                    => 'osu',
        'name'                     => 'oruko',
        'national_code'            => 'koodu orilẹ-ede',
        'number'                   => 'nọmba',
        'password'                 => 'ọrọigbaniwọle',
        'password_confirmation'    => 'ìmúdájú ọrọigbaniwọle',
        'phone'                    => 'foonu',
        'photo'                    => 'aworan',
        'portfolio'                => 'portfolio',
        'postal_code'              => 'koodu ifiweranse',
        'preview'                  => 'awotẹlẹ',
        'price'                    => 'owo',
        'product_id'               => 'ọja ID',
        'product_uid'              => 'ọja UID',
        'product_uuid'             => 'ọja UUID',
        'promo_code'               => 'ipolowo koodu',
        'province'                 => 'ekun',
        'quantity'                 => 'opoiye',
        'reason'                   => 'idi',
        'recaptcha_response_field' => 'recaptcha esi aaye',
        'referee'                  => 'referee',
        'referees'                 => 'awọn onidajọ',
        'reject_reason'            => 'kọ idi',
        'remember'                 => 'ranti',
        'restored_at'              => 'pada ni',
        'result_text_under_image'  => 'ọrọ abajade labẹ aworan',
        'role'                     => 'ipa',
        'rule'                     => 'ofin',
        'rules'                    => 'awọn ofin',
        'second'                   => 'keji',
        'sex'                      => 'ibalopo',
        'shipment'                 => 'gbigbe',
        'short_text'               => 'ọrọ kukuru',
        'size'                     => 'iwọn',
        'skills'                   => 'ogbon',
        'slug'                     => 'onilọra',
        'specialization'           => 'pataki',
        'started_at'               => 'bere ni',
        'state'                    => 'ipinle',
        'status'                   => 'ipo',
        'street'                   => 'opopona',
        'student'                  => 'akeko',
        'subject'                  => 'koko ọrọ',
        'tag'                      => 'tag',
        'tags'                     => 'awọn afi',
        'teacher'                  => 'olukọ',
        'terms'                    => 'awọn ofin',
        'test_description'         => 'igbeyewo apejuwe',
        'test_locale'              => 'igbeyewo agbegbe',
        'test_name'                => 'igbeyewo orukọ',
        'text'                     => 'ọrọ',
        'time'                     => 'aago',
        'title'                    => 'akọle',
        'type'                     => 'iru',
        'updated_at'               => 'imudojuiwọn ni',
        'user'                     => 'olumulo',
        'username'                 => 'orukọ olumulo',
        'value'                    => 'iye',
        'year'                     => 'odun',
    ],
];
