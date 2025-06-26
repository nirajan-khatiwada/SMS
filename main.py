def main(time):
    hour,minute=time.split(":")
    AMPM = "AM"
    if int(hour)>12:
        hour = str(int(hour)-12)
        if str(int(hour)) < '10':
            hour.lstrip('0')
        AMPM="PM"
    elif int(hour) == 12:
        AMPM = "PM"
        hour = '12'
    elif int(hour) == 0:
        hour='12'
        AMPM="AM"
        if str(int(hour)) < '10':
            hour.lstrip('0')
    return f'{hour}:{minute} {AMPM}'


print(main("9:05"))



test_cases = [
    ("0:00", "12:00 AM"),
    ("0:01", "12:01 AM"),
    ("1:00", "1:00 AM"),
    ("2:15", "2:15 AM"),
    ("3:45", "3:45 AM"),
    ("4:59", "4:59 AM"),
    ("5:30", "5:30 AM"),
    ("6:06", "6:06 AM"),
    ("7:07", "7:07 AM"),
    ("8:08", "8:08 AM"),
    ("9:09", "9:09 AM"),
    ("10:10", "10:10 AM"),
    ("11:11", "11:11 AM"),
    ("12:00", "12:00 PM"),
    ("12:34", "12:34 PM"),
    ("13:13", "1:13 PM"),
    ("14:14", "2:14 PM"),
    ("15:15", "3:15 PM"),
    ("16:16", "4:16 PM"),
    ("17:17", "5:17 PM"),
    ("18:18", "6:18 PM"),
    ("19:19", "7:19 PM"),
    ("20:20", "8:20 PM"),
    ("21:21", "9:21 PM"),
    ("23:59", "11:59 PM"),
]


for i, (input_time, expected_output) in enumerate(test_cases, 1):
    result = main(input_time)
    status = "✅ Pass" if result == expected_output else f"❌ Fail (Got {result})"
    print(f"Test {i}: Input={input_time} | Expected={expected_output} → {status}")
