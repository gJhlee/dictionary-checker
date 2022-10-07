# Dictionary Checker

Javascript 파일에 선언된 dictionary 형태의 중복된 문자열 선언을 찾아줍니다.


# 사용법

아래 링크에서 사용할 수 있습니다.

[Link](https://gjhlee.github.io/dictionary-checker)


# 예제

```javascript
var i18nKorean = {
    title: {
        a: "에이",
        b: "비",
        c: "씨"
    },
    content: {
        a: "에이",
        bb: "비"
    }
};
```

## 결과
```
요약
중복됨 : 2
단어 수: 3
전체 항목 수: 5

에이 (2)
 - i18nKorean.title.a
 - i18nKorean.content.a
비 (2)
 - i18nKorean.title.b
 - i18nKorean.content.bb
```
